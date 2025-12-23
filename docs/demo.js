/**
 * a11y-feedback Demo Site Interactive Script
 * Comprehensive demo with screen reader simulation, playground, and form validation
 */

(function () {
  'use strict';

  // Get the library from the global namespace (UMD build)
  const { 
    notify, 
    configureFeedback, 
    enableFeedbackDebug, 
    onFeedback,
    onAnyFeedback 
  } = window.A11yFeedback;

  // State
  let visualModeEnabled = false;
  let announceCount = 0;
  let isSaving = false;

  // DOM Elements
  const visualToggle = document.getElementById('visual-toggle');
  const saveStatus = document.getElementById('save-status');
  const announceCountEl = document.getElementById('announce-count');
  const srTimeline = document.getElementById('sr-timeline');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const playgroundCode = document.getElementById('playground-code');
  const playgroundLog = document.getElementById('playground-log');
  const validationForm = document.getElementById('validation-form');

  // Enable debug mode
  enableFeedbackDebug();

  // ==========================================================================
  // Screen Reader Simulation Panel
  // ==========================================================================

  function addSREntry(message, type, politeness) {
    const srEmpty = srTimeline.querySelector('.sr-empty');
    if (srEmpty) {
      srEmpty.remove();
    }

    const entry = document.createElement('div');
    entry.className = 'sr-entry';
    entry.innerHTML = `
      <span class="sr-entry-time">${new Date().toLocaleTimeString()}</span>
      <div class="sr-entry-content">
        <span class="sr-entry-type sr-entry-type-${politeness}">${politeness}</span>
        <span class="sr-entry-message">${escapeHtml(message)}</span>
      </div>
    `;

    srTimeline.insertBefore(entry, srTimeline.firstChild);

    // Limit entries
    while (srTimeline.children.length > 20) {
      srTimeline.removeChild(srTimeline.lastChild);
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Clear SR panel button
  document.querySelector('.sr-panel-clear')?.addEventListener('click', function() {
    srTimeline.innerHTML = '<div class="sr-empty">Announcements will appear here as you interact...</div>';
  });

  // Subscribe to all feedback events
  onAnyFeedback(function(type, payload) {
    if (type === 'announced') {
      const event = payload.event;
      const politeness = event.ariaLive === 'assertive' ? 'assertive' : 'polite';
      addSREntry(event.message, event.type, politeness);
    }
  });

  // ==========================================================================
  // Mobile Navigation
  // ==========================================================================

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', (!isExpanded).toString());
      mobileNav.hidden = isExpanded;
    });

    // Close mobile nav when clicking a link
    mobileNav.querySelectorAll('.mobile-nav-link').forEach(function(link) {
      link.addEventListener('click', function() {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileNav.hidden = true;
      });
    });

    // Close on escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !mobileNav.hidden) {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileNav.hidden = true;
        mobileMenuBtn.focus();
      }
    });
  }

  // ==========================================================================
  // Visual Mode Toggle
  // ==========================================================================

  visualToggle?.addEventListener('click', function () {
    visualModeEnabled = !visualModeEnabled;
    this.setAttribute('aria-checked', visualModeEnabled.toString());

    configureFeedback({
      visual: visualModeEnabled,
      visualPosition: 'top-right',
      maxVisualItems: 5
    });

    if (visualModeEnabled) {
      notify.info('Visual feedback mode enabled. Toast notifications will now appear.');
    } else {
      notify.info('Visual feedback mode disabled. Only screen reader announcements active.');
    }
  });

  // ==========================================================================
  // Framework Tabs
  // ==========================================================================

  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const targetId = this.getAttribute('aria-controls');
      
      // Update buttons
      tabButtons.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');

      // Update panels
      tabPanels.forEach(function(panel) {
        panel.classList.remove('active');
        panel.hidden = true;
      });
      
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
        targetPanel.hidden = false;
      }
    });

    // Keyboard navigation for tabs
    btn.addEventListener('keydown', function(e) {
      let newIndex;
      const currentIndex = Array.from(tabButtons).indexOf(this);

      if (e.key === 'ArrowRight') {
        newIndex = (currentIndex + 1) % tabButtons.length;
      } else if (e.key === 'ArrowLeft') {
        newIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
      } else if (e.key === 'Home') {
        newIndex = 0;
      } else if (e.key === 'End') {
        newIndex = tabButtons.length - 1;
      }

      if (newIndex !== undefined) {
        e.preventDefault();
        tabButtons[newIndex].click();
        tabButtons[newIndex].focus();
      }
    });
  });

  // ==========================================================================
  // Basic Notification Buttons
  // ==========================================================================

  document.querySelectorAll('[data-action]').forEach(function (button) {
    button.addEventListener('click', function () {
      const action = this.getAttribute('data-action');
      handleAction(action);
    });
  });

  function handleAction(action) {
    switch (action) {
      case 'success':
        notify.success('Operation completed successfully!');
        incrementCount();
        break;

      case 'error':
        notify.error('Something went wrong. Please try again.');
        incrementCount();
        break;

      case 'warning':
        notify.warning('Your session will expire in 5 minutes.');
        incrementCount();
        break;

      case 'info':
        notify.info('New features are available. Check the changelog.');
        incrementCount();
        break;

      case 'loading':
        notify.loading('Processing your request...');
        incrementCount();
        break;

      case 'save-pattern':
        handleSavePattern(true);
        break;

      case 'save-error':
        handleSavePattern(false);
        break;

      case 'dedupe-test':
        handleDedupeTest();
        break;

      case 'force-test':
        handleForceTest();
        break;
    }
  }

  // ==========================================================================
  // Form Validation Demo
  // ==========================================================================

  if (validationForm) {
    validationForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('button[type="submit"]');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');
      
      // Clear previous errors
      this.querySelectorAll('.form-error').forEach(el => el.textContent = '');
      this.querySelectorAll('.form-input').forEach(el => {
        el.classList.remove('error');
        el.removeAttribute('aria-invalid');
      });

      // Validate fields
      const name = document.getElementById('form-name');
      const email = document.getElementById('form-email');
      const password = document.getElementById('form-password');
      const confirm = document.getElementById('form-confirm');
      const terms = document.getElementById('form-terms');

      let firstError = null;
      let errors = [];

      // Name validation
      if (!name.value.trim()) {
        setFieldError(name, 'name-error', 'Name is required');
        if (!firstError) firstError = name;
        errors.push('Name is required');
      } else if (name.value.trim().length < 2) {
        setFieldError(name, 'name-error', 'Name must be at least 2 characters');
        if (!firstError) firstError = name;
        errors.push('Name must be at least 2 characters');
      }

      // Email validation
      if (!email.value.trim()) {
        setFieldError(email, 'email-error', 'Email is required');
        if (!firstError) firstError = email;
        errors.push('Email is required');
      } else if (!email.value.includes('@') || !email.value.includes('.')) {
        setFieldError(email, 'email-error', 'Please enter a valid email address');
        if (!firstError) firstError = email;
        errors.push('Please enter a valid email address');
      }

      // Password validation
      if (!password.value) {
        setFieldError(password, 'password-error', 'Password is required');
        if (!firstError) firstError = password;
        errors.push('Password is required');
      } else if (password.value.length < 8) {
        setFieldError(password, 'password-error', 'Password must be at least 8 characters');
        if (!firstError) firstError = password;
        errors.push('Password must be at least 8 characters');
      }

      // Confirm password
      if (password.value && password.value !== confirm.value) {
        setFieldError(confirm, 'confirm-error', 'Passwords do not match');
        if (!firstError) firstError = confirm;
        errors.push('Passwords do not match');
      }

      // Terms checkbox
      if (!terms.checked) {
        document.getElementById('terms-error').textContent = 'You must agree to the Terms of Service';
        if (!firstError) firstError = terms;
        errors.push('You must agree to the Terms of Service');
      }

      // If errors, announce and focus first error
      if (errors.length > 0) {
        notify.error(`Please fix ${errors.length} error${errors.length > 1 ? 's' : ''}: ${errors[0]}`, {
          focus: '#' + firstError.id,
          explainFocus: true
        });
        return;
      }

      // Show loading state
      btnText.hidden = true;
      btnLoading.hidden = false;
      submitBtn.disabled = true;

      notify.loading('Creating your account...', { id: 'form-submit' });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Success
      notify.success('Account created successfully! Welcome aboard.', { id: 'form-submit' });
      
      btnText.hidden = false;
      btnLoading.hidden = true;
      submitBtn.disabled = false;
      
      // Reset form
      this.reset();
    });

    validationForm.addEventListener('reset', function() {
      this.querySelectorAll('.form-error').forEach(el => el.textContent = '');
      this.querySelectorAll('.form-input').forEach(el => {
        el.classList.remove('error');
        el.removeAttribute('aria-invalid');
      });
      notify.info('Form has been reset.');
    });
  }

  function setFieldError(field, errorId, message) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    document.getElementById(errorId).textContent = message;
  }

  // ==========================================================================
  // Loading → Success Pattern
  // ==========================================================================

  function handleSavePattern(shouldSucceed) {
    if (isSaving) return;

    isSaving = true;

    saveStatus.innerHTML = '<span class="status-loading">⏳ Saving changes...</span>';

    notify.loading('Saving your changes...', { id: 'save-operation' });
    incrementCount();

    setTimeout(function () {
      if (shouldSucceed) {
        notify.success('Changes saved successfully!', { id: 'save-operation' });
        saveStatus.innerHTML = '<span class="status-success">✓ Saved!</span>';
      } else {
        notify.error('Failed to save changes. Please try again.', { id: 'save-operation' });
        saveStatus.innerHTML = '<span class="status-error">✕ Save failed</span>';
      }
      incrementCount();

      setTimeout(function () {
        saveStatus.innerHTML = '<span class="status-idle">Click to start</span>';
        isSaving = false;
      }, 3000);
    }, 2000);
  }

  // ==========================================================================
  // Deduplication Demos
  // ==========================================================================

  function handleDedupeTest() {
    notify.info('This message is deduplicated when clicked rapidly.');
    incrementCount();
  }

  function handleForceTest() {
    notify.info('This message is always announced!', { force: true });
    incrementCount();
  }

  // ==========================================================================
  // API Playground
  // ==========================================================================

  const runCodeBtn = document.getElementById('run-code');
  const clearOutputBtn = document.getElementById('clear-output');

  if (runCodeBtn && playgroundCode && playgroundLog) {
    runCodeBtn.addEventListener('click', function() {
      const code = playgroundCode.value;
      
      // Clear previous output
      playgroundLog.innerHTML = '';
      
      // Log function for output
      const logToPlayground = function(message, type = 'info') {
        const entry = document.createElement('div');
        entry.className = `log-entry log-entry-${type}`;
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        playgroundLog.appendChild(entry);
        playgroundLog.scrollTop = playgroundLog.scrollHeight;
      };

      // Override console.log temporarily
      const originalLog = console.log;
      console.log = function(...args) {
        logToPlayground(args.join(' '), 'info');
        originalLog.apply(console, args);
      };

      try {
        // Execute the code with notify available
        const func = new Function('notify', 'configureFeedback', 'onFeedback', code);
        func(notify, configureFeedback, onFeedback);
        logToPlayground('Code executed successfully', 'success');
      } catch (error) {
        logToPlayground(`Error: ${error.message}`, 'error');
      }

      // Restore console.log
      console.log = originalLog;
    });

    clearOutputBtn?.addEventListener('click', function() {
      playgroundLog.innerHTML = '<div class="log-entry log-entry-info">[Ready] Click "Run Code" to execute</div>';
    });
  }

  // Example code snippets
  const examples = {
    basic: `// Basic notifications
notify.success('Profile saved successfully!')
notify.info('New message received')
notify.warning('Low storage space')
notify.error('Connection lost')`,

    loading: `// Loading → Success pattern
notify.loading('Uploading file...', { id: 'upload' })

// Simulate upload completion
setTimeout(() => {
  notify.success('File uploaded!', { id: 'upload' })
}, 2000)`,

    events: `// Listen to feedback events
onFeedback('announced', ({ event, region }) => {
  console.log(\`Announced to \${region}: \${event.message}\`)
})

// Trigger some notifications
notify.success('This will be logged')
notify.error('This too!')`,

    config: `// Configure visual feedback
configureFeedback({
  visual: true,
  visualPosition: 'bottom-right',
  maxVisualItems: 3
})

notify.info('Visual toasts enabled!')
notify.success('Try clicking multiple times')
notify.warning('Only 3 will show at once')`
  };

  document.querySelectorAll('.example-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const exampleName = this.getAttribute('data-example');
      if (examples[exampleName] && playgroundCode) {
        playgroundCode.value = examples[exampleName];
      }
    });
  });

  // ==========================================================================
  // Copy to Clipboard
  // ==========================================================================

  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const textToCopy = this.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(
        function () {
          btn.classList.add('copied');
          const copyText = btn.querySelector('.copy-text');
          if (copyText) {
            copyText.textContent = 'Copied!';
          }

          notify.success('Copied to clipboard');

          setTimeout(function () {
            btn.classList.remove('copied');
            if (copyText) {
              copyText.textContent = 'Copy';
            }
          }, 2000);
        },
        function () {
          notify.error('Failed to copy to clipboard');
        }
      );
    });
  });

  // ==========================================================================
  // Smooth Scrolling for Anchor Links
  // ==========================================================================

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        
        // Close mobile nav if open
        if (mobileNav && !mobileNav.hidden) {
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
          mobileNav.hidden = true;
        }
        
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Set focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  });

  // ==========================================================================
  // Utility
  // ==========================================================================

  function incrementCount() {
    announceCount++;
    if (announceCountEl) {
      announceCountEl.textContent = announceCount.toString();
    }
  }

  // ==========================================================================
  // Initialize
  // ==========================================================================

  // Welcome message (delayed)
  setTimeout(function () {
    notify.info('Welcome to the a11y-feedback demo! Try the controls to see it in action.', {
      id: 'welcome'
    });
  }, 500);
})();
