/**
 * 3e Daily Command Center - Advanced Application Logic
 * Optimized for gifted, ADHD, and ASD individuals
 * 
 * Features:
 * - Advanced state management with undo/redo
 * - Comprehensive keyboard shortcuts
 * - Focus mode with Pomodoro timer
 * - Crisis/overwhelm management
 * - Smart energy-based task filtering
 * - Analytics and pattern recognition
 * - Accessibility optimizations
 * - Performance monitoring
 */

'use strict';

/* ===== Core Application Class ===== */

class ThreeEPlannerApp {
  constructor() {
    this.version = '3.0.0';
    this.initialized = false;
    
    // Core modules
    this.stateManager = new StateManager();
    this.shortcutManager = new ShortcutManager();
    this.focusManager = new FocusManager();
    this.analyticsManager = new AnalyticsManager();
    this.accessibilityManager = new AccessibilityManager();
    
    // UI managers
    this.toastManager = new ToastManager();
    this.commandPalette = new CommandPalette();
    this.settingsPanel = new SettingsPanel();
    
    // Performance monitoring
    this.performanceMonitor = new PerformanceMonitor();
    
    // Bind methods
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
    
    // Initialize application
    this.init();
  }

  async init() {
    try {
      this.performanceMonitor.mark('app-init-start');
      
      // Show loading screen
      this.showLoadingProgress(0, 'Initializing application...');
      
      // Initialize core systems
      await this.initializeCore();
      this.showLoadingProgress(25, 'Loading user data...');
      
      // Load user data
      await this.stateManager.loadState();
      this.showLoadingProgress(50, 'Setting up interface...');
      
      // Initialize UI
      await this.initializeUI();
      this.showLoadingProgress(75, 'Configuring accessibility...');
      
      // Setup event listeners
      this.setupEventListeners();
      this.showLoadingProgress(90, 'Finalizing setup...');
      
      // Final setup
      await this.finalizeInitialization();
      this.showLoadingProgress(100, 'Ready!');
      
      // Hide loading screen
      setTimeout(() => this.hideLoadingScreen(), 500);
      
      this.performanceMonitor.mark('app-init-end');
      this.performanceMonitor.measure('app-init', 'app-init-start', 'app-init-end');
      
      this.initialized = true;
      this.toastManager.show('Welcome to your 3e Command Center! 🧠', 'success');
      
    } catch (error) {
      console.error('Failed to initialize application:', error);
      this.handleInitializationError(error);
    }
  }

  async initializeCore() {
    // Initialize state management
    await this.stateManager.init();
    
    // Initialize analytics
    this.analyticsManager.init(this.stateManager);
    
    // Initialize accessibility features
    this.accessibilityManager.init();
    
    // Setup performance monitoring
    this.performanceMonitor.init();
  }

  async initializeUI() {
    // Initialize UI components
    this.commandPalette.init();
    this.settingsPanel.init();
    
    // Render initial state
    this.renderDashboard();
    this.updateTimeDisplay();
    
    // Setup theme
    this.applyTheme(this.stateManager.state.settings.theme);
    
    // Setup energy level
    this.updateEnergyDisplay();
  }

  setupEventListeners() {
    // Keyboard shortcuts
    document.addEventListener('keydown', this.handleKeydown);
    
    // Page visibility for focus tracking
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Before unload for data persistence
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    
    // Time updates
    setInterval(() => this.updateTimeDisplay(), 1000);
    
    // Auto-save
    setInterval(() => this.stateManager.saveState(), 30000);
    
    // Break reminders
    setInterval(() => this.checkBreakReminders(), 60000);
  }

  async finalizeInitialization() {
    // Initialize keyboard shortcuts
    this.shortcutManager.init();
    
    // Initialize focus manager
    this.focusManager.init(this.stateManager);
    
    // Setup daily reset check
    this.checkDailyReset();
    
    // Initialize service worker for PWA
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
      } catch (error) {
        console.warn('Service Worker registration failed:', error);
      }
    }
  }

  /* ===== Loading Management ===== */

  showLoadingProgress(percentage, message) {
    const loadingBar = document.getElementById('loadingBar');
    const loadingText = document.querySelector('.loading-text');
    
    if (loadingBar) {
      loadingBar.style.width = `${percentage}%`;
    }
    
    if (loadingText) {
      loadingText.textContent = message;
    }
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => loadingScreen.remove(), 500);
    }
  }

  handleInitializationError(error) {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.innerHTML = `
        <div class="loading-content">
          <div class="loading-logo">⚠️</div>
          <div class="loading-text">Failed to initialize application</div>
          <div style="margin-top: 1rem; color: var(--danger);">${error.message}</div>
          <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 1rem;">
            Reload Application
          </button>
        </div>
      `;
    }
  }

  /* ===== Event Handlers ===== */

  handleKeydown(event) {
    // Delegate to shortcut manager
    this.shortcutManager.handleKeydown(event);
  }

  handleVisibilityChange() {
    if (document.hidden) {
      this.focusManager.pauseFocusSession();
    } else {
      this.focusManager.resumeFocusSession();
    }
  }

  handleBeforeUnload() {
    this.stateManager.saveState();
    this.analyticsManager.trackSession();
  }

  /* ===== Core UI Updates ===== */

  renderDashboard() {
    this.renderPriorities();
    this.renderTasks();
    this.renderTimeBlocks();
    this.renderThoughts();
    this.updateStats();
  }

  updateTimeDisplay() {
    const now = new Date();
    const timeElement = document.getElementById('currentTime');
    const dateElement = document.getElementById('currentDate');
    
    if (timeElement) {
      timeElement.textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
    
    if (dateElement) {
      dateElement.textContent = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }

  updateEnergyDisplay() {
  const state = this.stateManager.state;
  const selector = document.getElementById('energySelector');
  
  if (selector) {
    selector.value = state.currentEnergy;
  }
  
  document.body.setAttribute('data-energy', state.currentEnergy);
}
  updateStats() {
    const state = this.stateManager.state;
    const today = new Date().toDateString();
    
    // Calculate priorities completed
    const completedPriorities = state.priorities.filter(p => p.completed && p.text.trim()).length;
    const totalPriorities = state.priorities.filter(p => p.text.trim()).length;
    
    // Calculate tasks completed today
    const tasksCompletedToday = state.tasks.filter(t => 
      t.completed && new Date(t.completedAt || t.createdAt).toDateString() === today
    ).length;
    
    // Calculate focus time today
    const focusTimeToday = this.analyticsManager.getFocusTimeForDate(today);
    
    // Update UI
    this.updateElement('priorityStat .stat-value', `${completedPriorities}/${totalPriorities}`);
    this.updateElement('taskStat .stat-value', tasksCompletedToday.toString());
    this.updateElement('focusStat .stat-value', `${Math.round(focusTimeToday)}m`);
    this.updateElement('streakStat .stat-value', state.analytics.currentStreak.toString());
  }

  updateElement(selector, content) {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = content;
    }
  }

  /* ===== Priority Management ===== */

  renderPriorities() {
    const state = this.stateManager.state;
    const priorityInputs = document.querySelectorAll('.priority-input');
    const priorityCheckboxes = document.querySelectorAll('.priority-checkbox');
    const energySelects = document.querySelectorAll('.energy-select');
    
    priorityInputs.forEach((input, index) => {
      if (state.priorities[index]) {
        input.value = state.priorities[index].text;
        input.addEventListener('blur', () => this.updatePriorityText(index, input.value));
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            input.blur();
          }
        });
      }
    });
    
    priorityCheckboxes.forEach((checkbox, index) => {
      if (state.priorities[index]) {
        checkbox.checked = state.priorities[index].completed;
        checkbox.addEventListener('change', () => this.togglePriority(index));
      }
    });
    
    energySelects.forEach((select, index) => {
      if (state.priorities[index]) {
        select.value = state.priorities[index].energy || 'medium';
        select.addEventListener('change', () => this.updatePriorityEnergy(index, select.value));
      }
    });
  }

  updatePriorityText(index, text) {
    this.stateManager.updatePriority(index, { text: text.trim() });
    this.updateStats();
    
    if (text.trim()) {
      this.analyticsManager.trackEvent('priority_updated', { index, hasText: true });
    }
  }

  togglePriority(index) {
    const priority = this.stateManager.state.priorities[index];
    if (!priority || !priority.text.trim()) return;
    
    this.stateManager.updatePriority(index, { 
      completed: !priority.completed,
      completedAt: !priority.completed ? new Date().toISOString() : null
    });
    
    this.updateStats();
    
    if (!priority.completed) {
      this.toastManager.show(`Priority completed! 🎯 ${priority.text}`, 'success');
      this.analyticsManager.trackAchievement('priority_completed');
    }
  }

  updatePriorityEnergy(index, energy) {
    this.stateManager.updatePriority(index, { energy });
    this.analyticsManager.trackEvent('priority_energy_updated', { index, energy });
  }
updatePriorityDetails(index, details) {
  const priority = this.stateManager.state.priorities[index];
  if (!priority) return;
  
  this.stateManager.updatePriority(index, details);
  this.renderPriorities();
  
  // Check for quick action if time estimate is ≤15 minutes
  if (details.estimatedMinutes && details.estimatedMinutes <= 15 && priority.text.trim()) {
    this.showQuickActionModal(priority, index, 'priority');
  }
  
  this.analyticsManager.trackEvent('priority_details_updated', { index, ...details });
}

openM365Link(index) {
  const priority = this.stateManager.state.priorities[index];
  if (priority && priority.m365Link) {
    window.open(priority.m365Link, '_blank');
    this.analyticsManager.trackEvent('m365_link_opened', { type: 'priority', index });
  }
}

editPriority(index) {
  const priority = this.stateManager.state.priorities[index];
  if (!priority) return;
  
  this.showPriorityEditModal(priority, index);
}
  focusOnPriority(index) {
    const priority = this.stateManager.state.priorities[index];
    if (!priority || !priority.text.trim()) {
      this.toastManager.show('Please add a priority first', 'warning');
      return;
    }
    
    this.focusManager.startFocusSession(priority.text, {
      type: 'priority',
      index,
      energy: priority.energy,
      estimatedDuration: this.estimatePriorityDuration(priority)
    });
  }

  estimatePriorityDuration(priority) {
    const energyMultipliers = { low: 0.8, medium: 1.0, high: 1.3 };
    const baseMinutes = 25; // Default Pomodoro
    return Math.round(baseMinutes * (energyMultipliers[priority.energy] || 1.0));
  }

  /* ===== Task Management ===== */

  renderTasks() {
    const state = this.stateManager.state;
    const container = document.getElementById('tasksContainer');
    const counter = document.getElementById('taskCounter');
    const emptyState = document.getElementById('tasksEmptyState');
    
    if (!container) return;
    
    // Update counter
    const activeTasks = state.tasks.filter(t => !t.completed);
    if (counter) {
      counter.textContent = `${activeTasks.length} tasks`;
    }
    
    // Show/hide empty state
    if (state.tasks.length === 0) {
      if (emptyState) emptyState.style.display = 'flex';
      return;
    } else {
      if (emptyState) emptyState.style.display = 'none';
    }
    
    // Render tasks
    container.innerHTML = state.tasks
      .filter(task => this.shouldShowTask(task))
      .map(task => this.createTaskHTML(task))
      .join('');
    
    // Add event listeners
    this.attachTaskEventListeners();
  }

  shouldShowTask(task) {
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter;
    
    switch (activeFilter) {
      case 'active':
        return !task.completed;
      case 'completed':
        return task.completed;
      case 'energy':
        return this.matchesCurrentEnergy(task);
      default:
        return true;
    }
  }

  matchesCurrentEnergy(task) {
    const currentEnergy = this.stateManager.state.currentEnergy;
    const taskEnergy = task.energy || 'medium';
    
    if (currentEnergy === 'crisis') {
      return taskEnergy === 'low';
    } else if (currentEnergy === 'low') {
      return taskEnergy !== 'high';
    } else {
      return true;
    }
  }

  createTaskHTML(task) {
    const energyClass = task.energy || 'medium';
    const completedClass = task.completed ? 'completed' : '';
    const createdDate = new Date(task.createdAt).toLocaleDateString();
    
    return `
      <div class="task-item ${energyClass}-energy ${completedClass}" data-task-id="${task.id}">
        <div class="checkbox-container">
          <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
          <label for="task-${task.id}" class="checkbox-label"></label>
        </div>
        <div class="task-content">
          <div class="task-text">${this.escapeHtml(task.text)}</div>
          <div class="task-meta">
            <span class="energy-badge">${this.capitalizeFirst(energyClass)} energy</span>
            <span class="task-date">Added ${createdDate}</span>
            ${task.estimatedMinutes ? `<span class="task-estimate">~${task.estimatedMinutes}min</span>` : ''}
          </div>
        </div>
        <div class="task-actions">
          ${!task.completed ? `
            <button class="btn-icon btn-focus" onclick="app.focusOnTask('${task.id}')" title="Focus on this task">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12,1v6M12,17v6M4.22,4.22l4.24,4.24M15.54,15.54l4.24,4.24M1,12h6M17,12h6M4.22,19.78l4.24-4.24M15.54,8.46l4.24-4.24"></path>
              </svg>
            </button>
            <select onchange="app.updateTaskEnergy('${task.id}', this.value)" class="task-energy-select">
              <option value="low" ${task.energy === 'low' ? 'selected' : ''}>🟢</option>
              <option value="medium" ${task.energy === 'medium' ? 'selected' : ''}>🟡</option>
              <option value="high" ${task.energy === 'high' ? 'selected' : ''}>🔴</option>
            </select>
          ` : ''}
          <button class="btn-icon btn-delete" onclick="app.deleteTask('${task.id}')" title="Delete task">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="M19,6v14a2,2 0,0,1-2,2H7a2,2 0,0,1-2-2V6M8,6V4a2,2 0,0,1,2-2h4a2,2 0,0,1,2,2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  attachTaskEventListeners() {
    // Checkbox listeners
    document.querySelectorAll('.task-item input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const taskId = e.target.id.replace('task-', '');
        this.toggleTask(taskId);
      });
    });
  }

  addTask() {
    const input = document.getElementById('taskInput');
    if (!input) return;
    
    const text = input.value.trim();
    if (!text) return;
    
    const task = {
      id: this.generateId(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      energy: this.suggestTaskEnergy(text),
      estimatedMinutes: this.estimateTaskDuration(text)
    };
    
    this.stateManager.addTask(task);
    input.value = '';
    
    this.renderTasks();
    this.updateStats();
    
    this.toastManager.show('Task added! 📝', 'success');
    this.analyticsManager.trackEvent('task_added', { energy: task.energy });
    
    // Check for achievements
    if (this.stateManager.state.tasks.length === 1) {
      this.toastManager.show('First task added! Great start! 🎯', 'success');
    }
  }

  toggleTask(taskId) {
    const task = this.stateManager.getTask(taskId);
    if (!task) return;
    
    this.stateManager.updateTask(taskId, {
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : null
    });
    
    this.renderTasks();
    this.updateStats();
    
    if (!task.completed) {
      this.toastManager.show(`Task completed! ✅ ${task.text.substring(0, 30)}...`, 'success');
      this.analyticsManager.trackAchievement('task_completed');
      this.checkTaskCompletionAchievements();
    }
  }

  deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    this.stateManager.deleteTask(taskId);
    this.renderTasks();
    this.updateStats();
    
    this.toastManager.show('Task deleted', 'info');
  }

  updateTaskEnergy(taskId, energy) {
    this.stateManager.updateTask(taskId, { energy });
    this.renderTasks();
    this.analyticsManager.trackEvent('task_energy_updated', { taskId, energy });
  }

  focusOnTask(taskId) {
    const task = this.stateManager.getTask(taskId);
    if (!task) return;
    
    this.focusManager.startFocusSession(task.text, {
      type: 'task',
      id: taskId,
      energy: task.energy,
      estimatedDuration: task.estimatedMinutes || 25
    });
  }

  suggestTaskEnergy(text) {
    const lowEnergyKeywords = ['read', 'review', 'check', 'organize', 'sort', 'email'];
    const highEnergyKeywords = ['create', 'write', 'design', 'develop', 'call', 'present', 'meeting'];
    
    const textLower = text.toLowerCase();
    
    if (lowEnergyKeywords.some(keyword => textLower.includes(keyword))) {
      return 'low';
    } else if (highEnergyKeywords.some(keyword => textLower.includes(keyword))) {
      return 'high';
    }
    
    return 'medium';
  }

  estimateTaskDuration(text) {
    const shortKeywords = ['check', 'email', 'quick', 'brief'];
    const longKeywords = ['project', 'report', 'presentation', 'research', 'develop'];
    
    const textLower = text.toLowerCase();
    
    if (shortKeywords.some(keyword => textLower.includes(keyword))) {
      return 15;
    } else if (longKeywords.some(keyword => textLower.includes(keyword))) {
      return 90;
    }
    
    return 25; // Default Pomodoro
  }

  checkTaskCompletionAchievements() {
    const completedToday = this.stateManager.getTasksCompletedToday().length;
    
    if (completedToday === 5) {
      this.toastManager.show('🏆 Five tasks completed today! You\'re on fire!', 'success');
    } else if (completedToday === 10) {
      this.toastManager.show('🚀 Ten tasks completed! Productivity master!', 'success');
    }
  }

  filterTasks(filter) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    // Re-render tasks
    this.renderTasks();
    
    this.analyticsManager.trackEvent('tasks_filtered', { filter });
  }

  filterByEnergy() {
    this.filterTasks('energy');
    
    const energyLabel = this.stateManager.state.currentEnergy;
    this.toastManager.show(`Showing ${energyLabel} energy tasks`, 'info');
  }

  /* ===== Time Block Management ===== */

  renderTimeBlocks() {
    const state = this.stateManager.state;
    const container = document.getElementById('timeblocksContainer');
    const emptyState = document.getElementById('timeblocksEmptyState');
    
    if (!container) return;
    
    if (state.timeBlocks.length === 0) {
      if (emptyState) emptyState.style.display = 'flex';
      return;
    } else {
      if (emptyState) emptyState.style.display = 'none';
    }
    
    // Sort by time
    const sortedBlocks = [...state.timeBlocks].sort((a, b) => a.startTime.localeCompare(b.startTime));
    
    container.innerHTML = sortedBlocks.map(block => this.createTimeBlockHTML(block)).join('');
    
    // Check for active blocks
    this.updateActiveTimeBlocks();
  }

  createTimeBlockHTML(block) {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const isActive = this.isTimeBlockActive(block, currentTime);
    const activeClass = isActive ? 'active' : '';
    
    return `
      <div class="timeblock-item ${activeClass}" data-block-id="${block.id}">
        <div class="timeblock-time">
          ${block.startTime}
          ${isActive ? '<span class="active-indicator">NOW</span>' : ''}
        </div>
        <div class="timeblock-content">
          <div class="timeblock-task">${this.escapeHtml(block.task || 'Untitled block')}</div>
          <div class="timeblock-duration">${block.duration} minutes</div>
        </div>
        <div class="timeblock-actions">
          ${isActive ? `
            <button class="btn btn-primary btn-sm" onclick="app.startTimeBlockFocus('${block.id}')">
              Start Focus
            </button>
          ` : ''}
          <button class="btn-icon" onclick="app.editTimeBlock('${block.id}')" title="Edit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11,4H4A2,2 0,0,0 2,6V18A2,2 0,0,0 4,20H16A2,2 0,0,0 18,18V13"></path>
              <path d="M18.5,2.5A2.12,2.12 0,0,1 21,4.62A2.12,2.12 0,0,1 18.5,6.74L10,15.25L6,16.25L7,12.25L15.5,3.75Z"></path>
            </svg>
          </button>
          <button class="btn-icon btn-delete" onclick="app.deleteTimeBlock('${block.id}')" title="Delete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="M19,6v14a2,2 0,0,1-2,2H7a2,2 0,0,1-2-2V6"></path>
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  isTimeBlockActive(block, currentTime) {
    const blockStart = this.timeStringToMinutes(block.startTime);
    const blockEnd = blockStart + block.duration;
    const currentMinutes = this.timeStringToMinutes(currentTime);
    
    return currentMinutes >= blockStart && currentMinutes < blockEnd;
  }

  timeStringToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  updateActiveTimeBlocks() {
    // This runs every minute to update active status
    setInterval(() => {
      this.renderTimeBlocks();
    }, 60000);
  }

  addTimeBlock() {
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const block = {
      id: this.generateId(),
      startTime: timeString,
      duration: 60,
      task: '',
      energy: this.stateManager.state.currentEnergy,
      createdAt: new Date().toISOString()
    };
    
    this.stateManager.addTimeBlock(block);
    this.renderTimeBlocks();
    
    // Focus on editing the new block
    setTimeout(() => this.editTimeBlock(block.id), 100);
  }

  editTimeBlock(blockId) {
    const block = this.stateManager.getTimeBlock(blockId);
    if (!block) return;
    
    const task = prompt('Time block task:', block.task);
    const startTime = prompt('Start time (HH:MM):', block.startTime);
    const duration = parseInt(prompt('Duration (minutes):', block.duration));
    
    if (task !== null && startTime !== null && !isNaN(duration)) {
      this.stateManager.updateTimeBlock(blockId, {
        task: task.trim(),
        startTime,
        duration
      });
      
      this.renderTimeBlocks();
      this.toastManager.show('Time block updated', 'success');
    }
  }

  deleteTimeBlock(blockId) {
    if (!confirm('Delete this time block?')) return;
    
    this.stateManager.deleteTimeBlock(blockId);
    this.renderTimeBlocks();
    this.toastManager.show('Time block deleted', 'info');
  }

  startTimeBlockFocus(blockId) {
    const block = this.stateManager.getTimeBlock(blockId);
    if (!block) return;
    
    this.focusManager.startFocusSession(block.task || 'Time Block', {
      type: 'timeblock',
      id: blockId,
      duration: block.duration,
      energy: block.energy
    });
  }

  /* ===== Thought/Distraction Management ===== */

  renderThoughts() {
    const state = this.stateManager.state;
    const container = document.getElementById('thoughtsContainer');
    const emptyState = document.getElementById('thoughtsEmptyState');
    const clearButton = document.getElementById('clearThoughtsBtn');
    
    if (!container) return;
    
    if (state.capturedThoughts.length === 0) {
      if (emptyState) emptyState.style.display = 'flex';
      if (clearButton) clearButton.disabled = true;
      return;
    } else {
      if (emptyState) emptyState.style.display = 'none';
      if (clearButton) clearButton.disabled = false;
    }
    
    // Show most recent thoughts first
    const recentThoughts = [...state.capturedThoughts]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10); // Limit to 10 most recent
    
    container.innerHTML = recentThoughts.map(thought => this.createThoughtHTML(thought)).join('');
  }

  createThoughtHTML(thought) {
    const timestamp = new Date(thought.timestamp).toLocaleTimeString();
    
    return `
      <div class="thought-item" data-thought-id="${thought.id}">
        <div class="thought-text">${this.escapeHtml(thought.text)}</div>
        <div class="thought-timestamp">${timestamp}</div>
      </div>
    `;
  }

  saveCapturedThought() {
    const input = document.getElementById('captureInput');
    if (!input) return;
    
    const text = input.value.trim();
    if (!text) return;
    
    const thought = {
      id: this.generateId(),
      text,
      timestamp: new Date().toISOString(),
      reviewed: false
    };
    
    this.stateManager.addThought(thought);
    input.value = '';
    
    this.renderThoughts();
    this.toggleQuickCapture();
    
    this.toastManager.show('Thought captured! 💭', 'success');
    this.analyticsManager.trackEvent('thought_captured', { length: text.length });
    
    // Check for achievement
    if (this.stateManager.state.capturedThoughts.length === 1) {
      this.toastManager.show('First distraction captured! Great focus technique! 🧠', 'success');
    }
  }

  clearThoughts() {
    if (!confirm('Clear all captured thoughts? This action cannot be undone.')) return;
    
    this.stateManager.clearThoughts();
    this.renderThoughts();
    this.toastManager.show('Thoughts cleared', 'info');
  }

  /* ===== Energy Level Management ===== */

  cycleEnergyLevel() {
    const levels = ['low', 'medium', 'high', 'crisis'];
    const currentIndex = levels.indexOf(this.stateManager.state.currentEnergy);
    const nextIndex = (currentIndex + 1) % levels.length;
    const newEnergy = levels[nextIndex];
    
    this.stateManager.updateEnergyLevel(newEnergy);
    this.updateEnergyDisplay();
    
    // Show energy-specific message
    const messages = {
      low: 'Low energy mode - focusing on gentle tasks 🟢',
      medium: 'Medium energy - balanced productivity 🟡',
      high: 'High energy - tackle challenging tasks! 🔴',
      crisis: 'Overwhelm mode - breaking things down 🆘'
    };
    
    this.toastManager.show(messages[newEnergy], 'info');
    
    // Auto-filter tasks if energy filter is active
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter;
    if (activeFilter === 'energy') {
      this.renderTasks();
    }
    
    // Show crisis mode if needed
    if (newEnergy === 'crisis') {
      setTimeout(() => this.enterCalmMode(), 1000);
    }
    
    this.analyticsManager.trackEvent('energy_level_changed', { newEnergy });
  }

  /* ===== Theme Management ===== */

  applyTheme(themeName) {
    document.body.className = `theme-${themeName}`;
    this.stateManager.updateSettings({ theme: themeName });
    
    // Update theme selector
    document.querySelectorAll('.theme-option').forEach(option => {
      option.classList.toggle('active', option.dataset.theme === themeName);
    });
    
    this.analyticsManager.trackEvent('theme_changed', { theme: themeName });
  }

  /* ===== Focus Mode Integration ===== */

  enterFocusMode() {
    // Show priority/task selection if none selected
    const state = this.stateManager.state;
    const nextPriority = state.priorities.find(p => !p.completed && p.text.trim());
    const nextTask = state.tasks.find(t => !t.completed);
    
    if (nextPriority) {
      this.focusManager.startFocusSession(nextPriority.text, {
        type: 'priority',
        index: state.priorities.indexOf(nextPriority),
        energy: nextPriority.energy
      });
    } else if (nextTask) {
      this.focusManager.startFocusSession(nextTask.text, {
        type: 'task',
        id: nextTask.id,
        energy: nextTask.energy
      });
    } else {
      this.focusManager.showFocusSelector();
    }
  }

  /* ===== Calm/Crisis Mode ===== */

  enterCalmMode() {
    const overlay = document.getElementById('calmMode');
    if (overlay) {
      overlay.classList.add('active');
      this.startBreathingGuide();
      this.showCalmAction();
    }
    
    this.analyticsManager.trackEvent('calm_mode_entered');
  }

  exitCalmMode() {
    const overlay = document.getElementById('calmMode');
    if (overlay) {
      overlay.classList.remove('active');
      this.stopBreathingGuide();
    }
  }

  startBreathingGuide() {
    const circle = document.querySelector('.breathing-circle');
    const text = document.getElementById('breathingText');
    
    if (!circle || !text) return;
    
    let phase = 'inhale';
    let cycle = 0;
    
    const updateBreathing = () => {
      if (phase === 'inhale') {
        text.textContent = 'Breathe in...';
        circle.className = 'breathing-circle inhale';
        setTimeout(() => {
          phase = 'exhale';
          updateBreathing();
        }, 4000);
      } else {
        text.textContent = 'Breathe out...';
        circle.className = 'breathing-circle exhale';
        setTimeout(() => {
          phase = 'inhale';
          cycle++;
          if (cycle < 3) {
            updateBreathing();
          } else {
            text.textContent = 'Well done 🌟';
            circle.className = 'breathing-circle';
          }
        }, 4000);
      }
    };
    
    updateBreathing();
  }

  stopBreathingGuide() {
    // Reset breathing guide
    const circle = document.querySelector('.breathing-circle');
    const text = document.getElementById('breathingText');
    
    if (circle) circle.className = 'breathing-circle';
    if (text) text.textContent = 'Breathe';
  }

  showCalmAction() {
    const actions = [
      'Take three deep breaths',
      'Drink a glass of water',
      'Look out the window for 30 seconds',
      'Write down how you\'re feeling',
      'Do 5 jumping jacks or stretch',
      'Organize one small area',
      'Listen to a favorite song',
      'Make a warm drink'
    ];
    
    const actionElement = document.getElementById('calmActionText');
    if (actionElement) {
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      actionElement.textContent = randomAction;
    }
  }

  completeCalmAction() {
    this.toastManager.show('Great job! 💪 You\'re taking care of yourself.', 'success');
    this.showNextCalmAction();
    this.analyticsManager.trackEvent('calm_action_completed');
  }

  showNextCalmAction() {
    this.showCalmAction();
  }

  getNextCalmAction() {
    this.showCalmAction();
  }

  /* ===== Quick Capture ===== */

  toggleQuickCapture() {
    const capture = document.getElementById('quickCapture');
    const input = document.getElementById('captureInput');
    
    if (!capture) return;
    
    const isActive = capture.classList.contains('active');
    
    if (isActive) {
      capture.classList.remove('active');
    } else {
      capture.classList.add('active');
      if (input) {
        setTimeout(() => input.focus(), 100);
      }
    }
  }

  /* ===== Settings Management ===== */

  toggleSettings() {
    this.settingsPanel.toggle();
  }

  /* ===== Daily Planning ===== */

  planPriorities() {
    // Focus on first empty priority
    const firstEmptyPriority = document.querySelector('.priority-input:not([value])');
    if (firstEmptyPriority) {
      firstEmptyPriority.focus();
      firstEmptyPriority.select();
    } else {
      // All filled, focus on first one
      const firstPriority = document.querySelector('.priority-input');
      if (firstPriority) {
        firstPriority.focus();
        firstPriority.select();
      }
    }
    
    this.toastManager.show('Plan your top 3 priorities for today', 'info');
  }

  /* ===== Analytics Integration ===== */

  viewAnalytics() {
    this.analyticsManager.showAnalytics();
  }

  /* ===== Break Reminders ===== */

  checkBreakReminders() {
    const now = new Date();
    const lastBreak = new Date(this.stateManager.state.lastBreakTime || 0);
    const breakInterval = this.stateManager.state.settings.breakInterval * 60 * 1000; // Convert to ms
    
    if (now - lastBreak > breakInterval) {
      this.suggestBreak();
    }
  }

  suggestBreak() {
    const suggestions = [
      '🧘 Take 5 deep breaths',
      '💧 Drink some water',
      '👀 Look away from screen for 20 seconds',
      '🚶 Walk around for 2 minutes',
      '🤸 Do some stretches',
      '🌅 Get some natural light'
    ];
    
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    
    if (confirm(`Break time! 🔔\n\n${randomSuggestion}\n\nTake a break now?`)) {
      this.takeBreak();
    }
  }

  takeBreak() {
    this.stateManager.updateState({ lastBreakTime: new Date().toISOString() });
    this.focusManager.pauseFocusSession();
    
    this.toastManager.show('Break taken! Your brain thanks you 🧠', 'success');
    this.analyticsManager.trackEvent('break_taken');
  }

  /* ===== Daily Reset ===== */

  checkDailyReset() {
    const today = new Date().toDateString();
    const lastActiveDate = this.stateManager.state.lastActiveDate;
    
    if (lastActiveDate !== today) {
      this.performDailyReset();
    }
  }

  performDailyReset() {
    const today = new Date().toDateString();
    
    // Reset daily counters
    this.stateManager.updateState({
      lastActiveDate: today,
      dailyTasksCompleted: 0,
      dailyFocusTime: 0,
      dailyBreaksTaken: 0
    });
    
    // Check streak
    this.updateProductivityStreak();
    
    // Welcome back message
    this.toastManager.show('Good morning! Ready for a productive day? 🌅', 'success');
    
    this.analyticsManager.trackEvent('daily_reset');
  }

  updateProductivityStreak() {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    const yesterdayStats = this.analyticsManager.getStatsForDate(yesterday);
    
    if (yesterdayStats.tasksCompleted > 0 || yesterdayStats.focusTime > 0) {
      // Productive day, continue streak
      this.stateManager.updateState({
        currentStreak: (this.stateManager.state.analytics.currentStreak || 0) + 1
      });
    } else {
      // Reset streak
      this.stateManager.updateState({ currentStreak: 0 });
    }
  }

  /* ===== Utility Methods ===== */

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /* ===== Global Methods for HTML onclick handlers ===== */

  addNewTask() {
    const input = document.getElementById('taskInput');
    if (input) {
      input.focus();
    }
  }

  /* ===== Data Management ===== */

  exportData() {
    try {
      const data = {
        version: this.version,
        exportDate: new Date().toISOString(),
        state: this.stateManager.state,
        analytics: this.analyticsManager.getFullAnalytics()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `3e-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      this.toastManager.show('Backup exported successfully! 💾', 'success');
      this.analyticsManager.trackEvent('data_exported');
      
    } catch (error) {
      console.error('Export failed:', error);
      this.toastManager.show('Export failed. Please try again.', 'error');
    }
  }

  importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (!data.version || !data.state) {
          throw new Error('Invalid backup file format');
        }
        
        if (confirm('This will replace all current data. Continue?')) {
          this.stateManager.importState(data.state);
          this.renderDashboard();
          this.toastManager.show('Data imported successfully! 📥', 'success');
          this.analyticsManager.trackEvent('data_imported');
        }
        
      } catch (error) {
        console.error('Import failed:', error);
        this.toastManager.show('Import failed. Please check the file format.', 'error');
      }
    };
    
    reader.readAsText(file);
    event.target.value = '';
  }

  resetAllData() {
    const confirmation = prompt('Type "RESET" to confirm deletion of all data:');
    if (confirmation !== 'RESET') return;
    
    this.stateManager.resetState();
    this.renderDashboard();
    
    this.toastManager.show('All data has been reset', 'info');
    this.analyticsManager.trackEvent('data_reset');
  }
}

/* ===== State Management System ===== */

class StateManager {
  constructor() {
    this.state = this.getDefaultState();
    this.history = [];
    this.historyIndex = -1;
    this.maxHistorySize = 50;
  }

  getDefaultState() {
    return {
      version: '3.0.0',
      lastActiveDate: new Date().toDateString(),
      currentEnergy: 'medium',
      
      priorities: [
  { 
    id: 1, text: '', completed: false, energy: 'medium',
    estimatedMinutes: null, m365Link: '', createdAt: new Date().toISOString(),
    completedAt: null, isRecurring: false, recurringPattern: null,
    category: '', notes: ''
  },
  { 
    id: 2, text: '', completed: false, energy: 'medium',
    estimatedMinutes: null, m365Link: '', createdAt: new Date().toISOString(),
    completedAt: null, isRecurring: false, recurringPattern: null,
    category: '', notes: ''
  },
  { 
    id: 3, text: '', completed: false, energy: 'medium',
    estimatedMinutes: null, m365Link: '', createdAt: new Date().toISOString(),
    completedAt: null, isRecurring: false, recurringPattern: null,
    category: '', notes: ''
  }
],
      
      tasks: [],
      timeBlocks: [],
      capturedThoughts: [],
      
      settings: {
        theme: 'focus',
        reducedMotion: false,
        soundEffects: false,
        keyboardHints: true,
        focusDuration: 25,
        breakInterval: 45,
        accessibleFont: false
      },
      
      analytics: {
        currentStreak: 0,
        totalFocusTime: 0,
        totalTasksCompleted: 0,
        totalBreaksTaken: 0,
        dailyStats: {},
        achievements: []
      },
      
      focusSession: {
        active: false,
        startTime: null,
        duration: 25,
        task: null,
        context: null
      },
      
      lastBreakTime: null
    };
  }

  async init() {
    await this.loadState();
    this.setupAutoSave();
  }

  async loadState() {
    try {
      const saved = localStorage.getItem('3e-planner-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = { ...this.getDefaultState(), ...parsed };
        
        // Migrate old data if needed
        this.migrateData();
      }
    } catch (error) {
      console.warn('Failed to load state:', error);
      this.state = this.getDefaultState();
    }
  }

  saveState() {
    try {
      localStorage.setItem('3e-planner-state', JSON.stringify(this.state));
    } catch (error) {
      console.warn('Failed to save state:', error);
      // Try to free up space by removing old analytics data
      this.cleanupOldAnalytics();
      try {
        localStorage.setItem('3e-planner-state', JSON.stringify(this.state));
      } catch (secondError) {
        console.error('Critical: Unable to save state even after cleanup:', secondError);
      }
    }
  }

  setupAutoSave() {
    // Auto-save every 30 seconds
    setInterval(() => this.saveState(), 30000);
    
    // Save on page unload
    window.addEventListener('beforeunload', () => this.saveState());
  }

  // State update methods with history tracking
  updateState(updates) {
    this.addToHistory();
    Object.assign(this.state, updates);
    this.saveState();
  }

  updatePriority(index, updates) {
    if (this.state.priorities[index]) {
      this.addToHistory();
      Object.assign(this.state.priorities[index], updates);
      this.saveState();
    }
  }

  addTask(task) {
    this.addToHistory();
    this.state.tasks.push(task);
    this.saveState();
  }

  updateTask(taskId, updates) {
    const task = this.getTask(taskId);
    if (task) {
      this.addToHistory();
      Object.assign(task, updates);
      this.saveState();
    }
  }

  deleteTask(taskId) {
    this.addToHistory();
    this.state.tasks = this.state.tasks.filter(t => t.id !== taskId);
    this.saveState();
  }

  getTask(taskId) {
    return this.state.tasks.find(t => t.id === taskId);
  }

  addTimeBlock(block) {
    this.addToHistory();
    this.state.timeBlocks.push(block);
    this.saveState();
  }

  updateTimeBlock(blockId, updates) {
    const block = this.getTimeBlock(blockId);
    if (block) {
      this.addToHistory();
      Object.assign(block, updates);
      this.saveState();
    }
  }

  deleteTimeBlock(blockId) {
    this.addToHistory();
    this.state.timeBlocks = this.state.timeBlocks.filter(b => b.id !== blockId);
    this.saveState();
  }

  getTimeBlock(blockId) {
    return this.state.timeBlocks.find(b => b.id === blockId);
  }

  addThought(thought) {
    this.addToHistory();
    this.state.capturedThoughts.push(thought);
    this.saveState();
  }

  clearThoughts() {
    this.addToHistory();
    this.state.capturedThoughts = [];
    this.saveState();
  }

  updateEnergyLevel(energy) {
    this.addToHistory();
    this.state.currentEnergy = energy;
    this.saveState();
  }

  updateSettings(settings) {
    this.addToHistory();
    Object.assign(this.state.settings, settings);
    this.saveState();
  }

  // History management for undo/redo
  addToHistory() {
    // Remove any future history if we're not at the end
    this.history = this.history.slice(0, this.historyIndex + 1);
    
    // Add current state to history
    this.history.push(JSON.parse(JSON.stringify(this.state)));
    
    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }
  }

  canUndo() {
    return this.historyIndex > 0;
  }

  canRedo() {
    return this.historyIndex < this.history.length - 1;
  }

  undo() {
    if (this.canUndo()) {
      this.historyIndex--;
      this.state = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this.saveState();
      return true;
    }
    return false;
  }

  redo() {
    if (this.canRedo()) {
      this.historyIndex++;
      this.state = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this.saveState();
      return true;
    }
    return false;
  }

  // Utility methods
  getTasksCompletedToday() {
    const today = new Date().toDateString();
    return this.state.tasks.filter(t => 
      t.completed && new Date(t.completedAt || t.createdAt).toDateString() === today
    );
  }

  migrateData() {
    // Handle data migration from older versions
    if (!this.state.version) {
      this.state.version = '3.0.0';
    }
    
    // Ensure all required properties exist
    if (!this.state.analytics) {
      this.state.analytics = this.getDefaultState().analytics;
    }
    
    if (!this.state.settings) {
      this.state.settings = this.getDefaultState().settings;
    }
  }

  cleanupOldAnalytics() {
    // Remove analytics data older than 30 days to free up space
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    if (this.state.analytics.dailyStats) {
      Object.keys(this.state.analytics.dailyStats).forEach(date => {
        if (new Date(date) < thirtyDaysAgo) {
          delete this.state.analytics.dailyStats[date];
        }
      });
    }
  }

  importState(newState) {
    this.addToHistory();
    this.state = { ...this.getDefaultState(), ...newState };
    this.migrateData();
    this.saveState();
  }

  resetState() {
    this.history = [];
    this.historyIndex = -1;
    this.state = this.getDefaultState();
    this.saveState();
  }
}

/* ===== Focus Management System ===== */

class FocusManager {
  constructor() {
    this.isActive = false;
    this.startTime = null;
    this.duration = 25; // minutes
    this.currentTask = null;
    this.currentContext = null;
    this.timer = null;
    this.isPaused = false;
    this.remainingTime = 0;
  }

  init(stateManager) {
    this.stateManager = stateManager;
    this.setupFocusOverlay();
  }

  setupFocusOverlay() {
    // Setup focus mode keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (this.isActive && e.key === 'Escape') {
        this.exitFocusMode();
      }
    });
  }

  startFocusSession(taskText, context = {}) {
    this.currentTask = taskText;
    this.currentContext = context;
    this.duration = context.estimatedDuration || 25;
    
    this.showFocusOverlay();
    this.updateFocusDisplay();
  }

  showFocusOverlay() {
    const overlay = document.getElementById('focusOverlay');
    if (overlay) {
      overlay.classList.add('active');
      this.isActive = true;
    }
  }

  updateFocusDisplay() {
    const titleElement = document.getElementById('focusTaskTitle');
    const detailsElement = document.getElementById('focusTaskDetails');
    const metaElement = document.getElementById('focusTaskMeta');
    const timerElement = document.getElementById('timerTime');
    
    if (titleElement && this.currentTask) {
      titleElement.textContent = this.currentTask;
    }
    
    if (detailsElement && this.currentContext) {
      const energyLabel = this.currentContext.energy || 'medium';
      detailsElement.textContent = `${energyLabel.charAt(0).toUpperCase() + energyLabel.slice(1)} energy task`;
    }
    
    if (metaElement && this.currentContext) {
      const type = this.currentContext.type || 'task';
      metaElement.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)}`;
    }
    
    if (timerElement) {
      this.updateTimerDisplay();
    }
  }

  beginFocusSession() {
    if (!this.currentTask) return;
    
    this.startTime = new Date();
    this.remainingTime = this.duration * 60; // Convert to seconds
    this.isPaused = false;
    
    this.startTimer();
    this.updateStartButton();
    
    // Track in analytics
    if (window.app) {
      window.app.analyticsManager.trackEvent('focus_session_started', {
        task: this.currentTask,
        duration: this.duration,
        context: this.currentContext
      });
    }
    
    // Show success message
    if (window.app) {
      window.app.toastManager.show(`Focus session started! 🎯 ${this.duration} minutes`, 'success');
    }
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (!this.isPaused) {
        this.remainingTime--;
        this.updateTimerDisplay();
        
        if (this.remainingTime <= 0) {
          this.completeFocusSession();
        }
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    const timerElement = document.getElementById('timerTime');
    if (timerElement) {
      timerElement.textContent = display;
    }
    
    // Update page title with timer
    if (this.isActive && !this.isPaused) {
      document.title = `${display} - Focus Mode`;
    }
  }

  updateStartButton() {
    const button = document.getElementById('startFocusBtn');
    const playPauseBtn = document.getElementById('timerPlayPause');
    
    if (button) {
      if (this.remainingTime > 0 && this.remainingTime < this.duration * 60) {
        button.textContent = this.isPaused ? '▶️ Resume Session' : '⏸️ Pause Session';
        button.onclick = () => this.toggleTimer();
      } else if (this.remainingTime === this.duration * 60) {
        button.textContent = '✨ Begin Focus Session';
        button.onclick = () => this.beginFocusSession();
      }
    }
    
    if (playPauseBtn) {
      const icon = this.isPaused || this.remainingTime === this.duration * 60 ? 
        '<polygon points="5,3 19,12 5,21"></polygon>' : // Play icon
        '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>'; // Pause icon
      playPauseBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icon}</svg>`;
    }
  }

  toggleTimer() {
    if (this.remainingTime === this.duration * 60) {
      this.beginFocusSession();
    } else {
      this.isPaused = !this.isPaused;
      this.updateStartButton();
      
      if (window.app) {
        const action = this.isPaused ? 'paused' : 'resumed';
        window.app.toastManager.show(`Focus session ${action}`, 'info');
        window.app.analyticsManager.trackEvent(`focus_session_${action}`);
      }
    }
  }

  resetTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    
    this.remainingTime = this.duration * 60;
    this.isPaused = false;
    this.updateTimerDisplay();
    this.updateStartButton();
    
    if (window.app) {
      window.app.toastManager.show('Timer reset', 'info');
    }
  }

  completeFocusSession() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    
    const sessionDuration = this.duration;
    
    // Track completion
    if (window.app) {
      window.app.analyticsManager.trackFocusSession(sessionDuration, this.currentTask, this.currentContext);
      window.app.toastManager.show(`🎯 Focus session complete! ${sessionDuration} minutes of deep work.`, 'success');
      
      // Suggest a break
      setTimeout(() => {
        if (confirm('Great job! 🎉\n\nTime for a well-deserved break?\n\n• 5-minute walk\n• Stretch break\n• Hydration break')) {
          window.app.takeBreak();
        }
      }, 2000);
    }
    
    // Reset timer for next session
    this.remainingTime = this.duration * 60;
    this.updateStartButton();
  }

  pauseFocusSession() {
    if (this.isActive && !this.isPaused) {
      this.isPaused = true;
      this.updateStartButton();
    }
  }

  resumeFocusSession() {
    if (this.isActive && this.isPaused) {
      this.isPaused = false;
      this.updateStartButton();
    }
  }

  exitFocusMode() {
    const overlay = document.getElementById('focusOverlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
    
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    
    this.isActive = false;
    this.isPaused = false;
    
    // Reset page title
    document.title = '3e Daily Command Center';
    
    if (window.app) {
      window.app.analyticsManager.trackEvent('focus_session_exited', {
        timeRemaining: this.remainingTime,
        completed: this.remainingTime === 0
      });
    }
  }

  showFocusSelector() {
    // Show focus mode with task selection prompt
    this.showFocusOverlay();
    
    const titleElement = document.getElementById('focusTaskTitle');
    if (titleElement) {
      titleElement.textContent = 'What would you like to focus on?';
    }
    
    // Focus on adding a priority or task
    if (window.app) {
      window.app.toastManager.show('Add a priority or task first, then start your focus session', 'info');
    }
  }

  showFocusHelp() {
    const helpTips = [
      'Just open the document or app related to this task',
      'Set a 2-minute timer and do ANYTHING related to this task',
      'Write down what you already know about this task',
      'Break it into 3 smaller steps first',
      'Do the easiest part first, even if it\'s just reading',
      'Set up your workspace - organize what you need',
      'Tell someone what you\'re about to work on',
      'Start with research or gathering information'
    ];
    
    const randomTip = helpTips[Math.floor(Math.random() * helpTips.length)];
    
    if (window.app) {
      window.app.toastManager.show(`💡 Try this: ${randomTip}`, 'info');
    }
  }
}

/* ===== Keyboard Shortcuts System ===== */

class ShortcutManager {
  constructor() {
    this.shortcuts = new Map();
    this.sequences = new Map();
    this.currentSequence = [];
    this.sequenceTimeout = null;
    this.enabled = true;
  }

  init() {
    this.registerShortcuts();
    this.setupEventListeners();
  }

  registerShortcuts() {
    // Global shortcuts
    this.register('KeyF', () => window.app.enterFocusMode(), 'Enter Focus Mode');
    this.register('KeyC', () => window.app.enterCalmMode(), 'Enter Calm Mode');
    this.register('KeyD', () => window.app.toggleQuickCapture(), 'Quick Capture');
    this.register('KeyT', () => this.focusTaskInput(), 'Focus Task Input');
    this.register('Space', () => this.toggleFirstTask(), 'Toggle First Task');
    this.register('KeyE', () => window.app.cycleEnergyLevel(), 'Cycle Energy Level');
    this.register('Escape', () => this.handleEscape(), 'Close/Cancel');
    
    // With modifiers
    this.register('KeyK', () => window.app.commandPalette.toggle(), 'Command Palette', ['ctrl']);
    this.register('KeyS', () => window.app.stateManager.saveState(), 'Save Data', ['ctrl']);
    this.register('KeyZ', () => this.undo(), 'Undo', ['ctrl']);
    this.register('KeyY', () => this.redo(), 'Redo', ['ctrl']);
    this.register('Comma', () => window.app.toggleSettings(), 'Settings', ['ctrl']);
    this.register('Slash', () => this.showShortcuts(), 'Show Shortcuts');
    
    // Number keys for quick selection
    for (let i = 1; i <= 9; i++) {
      this.register(`Digit${i}`, () => this.quickSelect(i - 1), `Quick Select ${i}`);
    }
    
    // Vi-style navigation
    this.register('KeyJ', () => this.navigateDown(), 'Navigate Down');
    this.register('KeyK', () => this.navigateUp(), 'Navigate Up');
    this.register('KeyH', () => this.navigateLeft(), 'Navigate Left');
    this.register('KeyL', () => this.navigateRight(), 'Navigate Right');
  }

  register(key, handler, description, modifiers = []) {
    const shortcutKey = this.createShortcutKey(key, modifiers);
    this.shortcuts.set(shortcutKey, {
      key,
      handler,
      description,
      modifiers: modifiers.slice()
    });
  }

  createShortcutKey(key, modifiers) {
    return [...modifiers.sort(), key].join('+');
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  handleKeydown(event) {
    if (!this.enabled) return;
    if (this.isInputField(event.target)) return;
    
    const { code, ctrlKey, shiftKey, altKey, metaKey } = event;
    const modifiers = [];
    
    if (ctrlKey) modifiers.push('ctrl');
    if (shiftKey) modifiers.push('shift');
    if (altKey) modifiers.push('alt');
    if (metaKey) modifiers.push('meta');
    
    const shortcutKey = this.createShortcutKey(code, modifiers);
    const shortcut = this.shortcuts.get(shortcutKey);
    
    if (shortcut) {
      event.preventDefault();
      shortcut.handler();
      
      if (window.app) {
        window.app.analyticsManager.trackEvent('shortcut_used', {
          shortcut: shortcut.description,
          key: shortcutKey
        });
      }
    }
  }

  isInputField(element) {
    const inputTypes = ['input', 'textarea', 'select'];
    const isContentEditable = element.contentEditable === 'true';
    return inputTypes.includes(element.tagName.toLowerCase()) || isContentEditable;
  }

  // Shortcut action handlers
  focusTaskInput() {
    const input = document.getElementById('taskInput');
    if (input) {
      input.focus();
      input.select();
    }
  }

  toggleFirstTask() {
    if (!window.app) return;
    
    const state = window.app.stateManager.state;
    const firstIncompleteTask = state.tasks.find(t => !t.completed);
    
    if (firstIncompleteTask) {
      window.app.toggleTask(firstIncompleteTask.id);
    } else {
      // Try first incomplete priority
      const firstIncompletePriority = state.priorities.find(p => p.text.trim() && !p.completed);
      if (firstIncompletePriority) {
        const index = state.priorities.indexOf(firstIncompletePriority);
        window.app.togglePriority(index);
      }
    }
  }

  handleEscape() {
    // Close any open overlays
    document.querySelectorAll('.active').forEach(el => {
      if (el.id === 'focusOverlay') window.app.focusManager.exitFocusMode();
      else if (el.id === 'calmMode') window.app.exitCalmMode();
      else if (el.id === 'commandPalette') window.app.commandPalette.close();
      else if (el.id === 'quickCapture') window.app.toggleQuickCapture();
    });
  }

  undo() {
    if (window.app && window.app.stateManager.canUndo()) {
      window.app.stateManager.undo();
      window.app.renderDashboard();
      window.app.toastManager.show('Action undone', 'info');
    }
  }

  redo() {
    if (window.app && window.app.stateManager.canRedo()) {
      window.app.stateManager.redo();
      window.app.renderDashboard();
      window.app.toastManager.show('Action redone', 'info');
    }
  }

  quickSelect(index) {
    // Quick select priorities, tasks, or other items
    const priorityCheckbox = document.getElementById(`priority-${index}`);
    if (priorityCheckbox) {
      priorityCheckbox.click();
      return;
    }
    
    const taskCheckboxes = document.querySelectorAll('.task-item input[type="checkbox"]');
    if (taskCheckboxes[index]) {
      taskCheckboxes[index].click();
    }
  }

  navigateDown() {
    this.navigateElements('down');
  }

  navigateUp() {
    this.navigateElements('up');
  }

  navigateLeft() {
    // Could implement horizontal navigation if needed
  }

  navigateRight() {
    // Could implement horizontal navigation if needed
  }

  navigateElements(direction) {
    const focusableElements = this.getFocusableElements();
    const currentIndex = focusableElements.indexOf(document.activeElement);
    
    let nextIndex;
    if (direction === 'down') {
      nextIndex = (currentIndex + 1) % focusableElements.length;
    } else {
      nextIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
    }
    
    focusableElements[nextIndex]?.focus();
  }

  getFocusableElements() {
    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    return Array.from(document.querySelectorAll(selector)).filter(el => {
      return el.offsetParent !== null && !el.disabled;
    });
  }

  showShortcuts() {
    const overlay = document.getElementById('shortcutsOverlay');
    if (overlay) {
      overlay.classList.add('active');
      this.renderShortcuts();
    }
  }

  renderShortcuts() {
    const grid = document.getElementById('shortcutsGrid');
    if (!grid) return;
    
    const categories = this.organizeShortcutsByCategory();
    
    grid.innerHTML = Object.entries(categories).map(([category, shortcuts]) => `
      <div class="shortcuts-category">
        <h3 class="shortcuts-category-title">${category}</h3>
        ${shortcuts.map(shortcut => `
          <div class="shortcut-item">
            <span class="shortcut-description">${shortcut.description}</span>
            <div class="shortcut-keys">
              ${this.formatShortcutKeys(shortcut)}
            </div>
          </div>
        `).join('')}
      </div>
    `).join('');
  }

  organizeShortcutsByCategory() {
    const categories = {
      'Navigation': [],
      'Tasks & Priorities': [],
      'Focus & Modes': [],
      'System': []
    };
    
    this.shortcuts.forEach((shortcut) => {
      const desc = shortcut.description.toLowerCase();
      
      if (desc.includes('navigate') || desc.includes('select')) {
        categories['Navigation'].push(shortcut);
      } else if (desc.includes('task') || desc.includes('priority') || desc.includes('toggle')) {
        categories['Tasks & Priorities'].push(shortcut);
      } else if (desc.includes('focus') || desc.includes('calm') || desc.includes('capture')) {
        categories['Focus & Modes'].push(shortcut);
      } else {
        categories['System'].push(shortcut);
      }
    });
    
    return categories;
  }

  formatShortcutKeys(shortcut) {
    const parts = [];
    
    shortcut.modifiers.forEach(mod => {
      switch (mod) {
        case 'ctrl': parts.push('Ctrl'); break;
        case 'shift': parts.push('Shift'); break;
        case 'alt': parts.push('Alt'); break;
        case 'meta': parts.push('Cmd'); break;
      }
    });
    
    // Format key name
    let keyName = shortcut.key;
    if (keyName.startsWith('Key')) {
      keyName = keyName.replace('Key', '');
    } else if (keyName.startsWith('Digit')) {
      keyName = keyName.replace('Digit', '');
    } else if (keyName === 'Space') {
      keyName = 'Space';
    } else if (keyName === 'Escape') {
      keyName = 'Esc';
    } else if (keyName === 'Slash') {
      keyName = '?';
    } else if (keyName === 'Comma') {
      keyName = ',';
    }
    
    parts.push(keyName);
    
    return parts.map(part => `<kbd class="kbd">${part}</kbd>`).join('');
  }

  toggleShortcutsOverlay() {
    const overlay = document.getElementById('shortcutsOverlay');
    if (overlay) {
      overlay.classList.toggle('active');
      if (overlay.classList.contains('active')) {
        this.renderShortcuts();
      }
    }
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }
}

/* ===== Analytics & Insights System ===== */

class AnalyticsManager {
  constructor() {
    this.analytics = {
      sessions: [],
      achievements: [],
      dailyStats: {},
      patterns: {}
    };
  }

  init(stateManager) {
    this.stateManager = stateManager;
    this.loadAnalytics();
    this.startSessionTracking();
  }

  loadAnalytics() {
    try {
      const saved = localStorage.getItem('3e-planner-analytics');
      if (saved) {
        this.analytics = { ...this.analytics, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('Failed to load analytics:', error);
    }
  }

  saveAnalytics() {
    try {
      localStorage.setItem('3e-planner-analytics', JSON.stringify(this.analytics));
    } catch (error) {
      console.warn('Failed to save analytics:', error);
    }
  }

  startSessionTracking() {
    this.sessionStartTime = new Date();
    this.trackEvent('session_started');
  }

  trackEvent(eventName, data = {}) {
    const event = {
      name: eventName,
      timestamp: new Date().toISOString(),
      data,
      sessionId: this.getSessionId()
    };
    
    if (!this.analytics.sessions) {
      this.analytics.sessions = [];
    }
    
    this.analytics.sessions.push(event);
    
    // Update daily stats
    this.updateDailyStats(eventName, data);
    
    // Save periodically
    if (this.analytics.sessions.length % 10 === 0) {
      this.saveAnalytics();
    }
  }

  trackAchievement(achievementType, data = {}) {
    const achievement = {
      type: achievementType,
      timestamp: new Date().toISOString(),
      data
    };
    
    if (!this.analytics.achievements) {
      this.analytics.achievements = [];
    }
    
    this.analytics.achievements.push(achievement);
    this.trackEvent('achievement_unlocked', { type: achievementType, ...data });
  }

  trackFocusSession(duration, task, context = {}) {
    this.trackEvent('focus_session_completed', {
      duration,
      task,
      context,
      date: new Date().toDateString()
    });
    
    // Update total focus time
    if (!this.stateManager.state.analytics.totalFocusTime) {
      this.stateManager.state.analytics.totalFocusTime = 0;
    }
    this.stateManager.state.analytics.totalFocusTime += duration;
  }

  updateDailyStats(eventName, data) {
    const today = new Date().toDateString();
    
    if (!this.analytics.dailyStats[today]) {
      this.analytics.dailyStats[today] = {
        tasksCompleted: 0,
        focusTime: 0,
        breaksTaken: 0,
        thoughtsCaptured: 0,
        events: {}
      };
    }
    
    const dayStats = this.analytics.dailyStats[today];
    
    // Update specific counters
    switch (eventName) {
      case 'task_completed':
        dayStats.tasksCompleted++;
        break;
      case 'focus_session_completed':
        dayStats.focusTime += data.duration || 0;
        break;
      case 'break_taken':
        dayStats.breaksTaken++;
        break;
      case 'thought_captured':
        dayStats.thoughtsCaptured++;
        break;
    }
    
    // Track event counts
    if (!dayStats.events[eventName]) {
      dayStats.events[eventName] = 0;
    }
    dayStats.events[eventName]++;
  }

  getFocusTimeForDate(date) {
    const dateStr = new Date(date).toDateString();
    return this.analytics.dailyStats[dateStr]?.focusTime || 0;
  }

  getStatsForDate(date) {
    const dateStr = new Date(date).toDateString();
    return this.analytics.dailyStats[dateStr] || {
      tasksCompleted: 0,
      focusTime: 0,
      breaksTaken: 0,
      thoughtsCaptured: 0
    };
  }

  showAnalytics() {
    const modal = document.getElementById('analyticsModal');
    if (modal) {
      modal.classList.add('active');
      this.renderAnalytics();
    }
  }

  renderAnalytics() {
    const content = document.getElementById('analyticsContent');
    if (!content) return;
    
    const stats = this.calculateOverallStats();
    const insights = this.generateInsights();
    
    content.innerHTML = `
      <div class="analytics-grid">
        <div class="analytics-card">
          <div class="analytics-number">${stats.totalFocusTime}</div>
          <div class="analytics-label">Minutes Focused</div>
        </div>
        <div class="analytics-card">
          <div class="analytics-number">${stats.totalTasksCompleted}</div>
          <div class="analytics-label">Tasks Completed</div>
        </div>
        <div class="analytics-card">
          <div class="analytics-number">${stats.currentStreak}</div>
          <div class="analytics-label">Day Streak</div>
        </div>
        <div class="analytics-card">
          <div class="analytics-number">${stats.totalBreaksTaken}</div>
          <div class="analytics-label">Breaks Taken</div>
        </div>
        <div class="analytics-card">
          <div class="analytics-number">${stats.thoughtsCaptured}</div>
          <div class="analytics-label">Thoughts Captured</div>
        </div>
        <div class="analytics-card">
          <div class="analytics-number">${stats.averageSessionLength}</div>
          <div class="analytics-label">Avg Focus (min)</div>
        </div>
      </div>
      
      <div class="insight-card">
        <div class="insight-icon">🧠</div>
        <div class="insight-content">
          <div class="insight-title">Your Productivity Patterns</div>
          <div class="insight-text">${insights.join(' • ')}</div>
        </div>
      </div>
      
      <div style="margin-top: 2rem;">
        <h3>Recent Achievements</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">
          ${this.renderRecentAchievements()}
        </div>
      </div>
    `;
  }

  calculateOverallStats() {
    const state = this.stateManager.state;
    const sessions = this.analytics.sessions || [];
    const focusSessions = sessions.filter(s => s.name === 'focus_session_completed');
    
    return {
      totalFocusTime: Math.round(state.analytics?.totalFocusTime || 0),
      totalTasksCompleted: state.analytics?.totalTasksCompleted || 0,
      currentStreak: state.analytics?.currentStreak || 0,
      totalBreaksTaken: Object.values(this.analytics.dailyStats || {})
        .reduce((sum, day) => sum + (day.breaksTaken || 0), 0),
      thoughtsCaptured: state.capturedThoughts?.length || 0,
      averageSessionLength: focusSessions.length > 0 
        ? Math.round(focusSessions.reduce((sum, s) => sum + (s.data.duration || 0), 0) / focusSessions.length)
        : 0
    };
  }

  generateInsights() {
    const insights = [];
    const state = this.stateManager.state;
    const sessions = this.analytics.sessions || [];
    const dailyStats = this.analytics.dailyStats || {};
    
    // Energy level insights
    const currentEnergy = state.currentEnergy;
    insights.push(`You work best with ${currentEnergy} energy levels`);
    
    // Task completion patterns
    const avgTasksPerDay = Object.values(dailyStats)
      .reduce((sum, day) => sum + day.tasksCompleted, 0) / Object.keys(dailyStats).length;
    
    if (avgTasksPerDay > 0) {
      insights.push(`You complete an average of ${Math.round(avgTasksPerDay)} tasks per day`);
    }
    
    // Focus session insights
    const focusSessions = sessions.filter(s => s.name === 'focus_session_completed');
    if (focusSessions.length > 0) {
      const avgFocusTime = focusSessions.reduce((sum, s) => sum + (s.data.duration || 0), 0) / focusSessions.length;
      insights.push(`Your average focus session is ${Math.round(avgFocusTime)} minutes`);
    }
    
    // Streak insights
    const streak = state.analytics?.currentStreak || 0;
    if (streak > 0) {
      insights.push(`You're on a ${streak}-day productivity streak! 🔥`);
    }
    
    // Thought capture insights
    if (state.capturedThoughts?.length > 5) {
      insights.push('Great job capturing distracting thoughts during focus time');
    }
    
    return insights;
  }

  renderRecentAchievements() {
    const achievements = this.analytics.achievements || [];
    const recent = achievements.slice(-10).reverse();
    
    if (recent.length === 0) {
      return '<div style="color: var(--text-secondary); font-style: italic;">No achievements yet. Keep going!</div>';
    }
    
    const achievementMap = {
      'task_completed': '✅',
      'priority_completed': '🎯',
      'focus_session_completed': '🧠',
      'break_taken': '🧘',
      'thought_captured': '💭'
    };
    
    return recent.map(achievement => {
      const icon = achievementMap[achievement.type] || '🏆';
      const date = new Date(achievement.timestamp).toLocaleDateString();
      return `
        <span style="display: inline-flex; align-items: center; gap: 0.25rem; background: var(--success-light); color: var(--success-dark); padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: var(--font-size-sm);">
          ${icon} ${achievement.type.replace('_', ' ')}
        </span>
      `;
    }).join('');
  }

  trackSession() {
    if (this.sessionStartTime) {
      const duration = (new Date() - this.sessionStartTime) / 1000 / 60; // minutes
      this.trackEvent('session_ended', { duration: Math.round(duration) });
      this.saveAnalytics();
    }
  }

  getSessionId() {
    if (!this.sessionId) {
      this.sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    return this.sessionId;
  }

  getFullAnalytics() {
    return this.analytics;
  }
}

/* ===== Toast Notification System ===== */

class ToastManager {
  constructor() {
    this.toasts = [];
    this.container = null;
    this.maxToasts = 5;
    this.defaultDuration = 4000;
  }

  init() {
    this.container = document.getElementById('toastContainer');
    if (!this.container) {
      this.createContainer();
    }
  }

  createContainer() {
    this.container = document.createElement('div');
    this.container.id = 'toastContainer';
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  }

  show(message, type = 'info', duration = null) {
    if (!this.container) this.init();
    
    const toast = this.createToast(message, type, duration || this.defaultDuration);
    this.toasts.push(toast);
    
    // Limit number of toasts
    if (this.toasts.length > this.maxToasts) {
      const oldToast = this.toasts.shift();
      this.removeToast(oldToast);
    }
    
    this.container.appendChild(toast.element);
    
    // Animate in
    requestAnimationFrame(() => {
      toast.element.classList.add('show');
    });
    
    // Auto remove
    toast.timeout = setTimeout(() => {
      this.removeToast(toast);
    }, toast.duration);
    
    return toast;
  }

  createToast(message, type, duration) {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    const element = document.createElement('div');
    element.className = `toast ${type}`;
    element.setAttribute('role', 'alert');
    element.setAttribute('aria-live', 'polite');
    
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    
    element.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-content">
        <div class="toast-message">${this.escapeHtml(message)}</div>
      </div>
      <button class="toast-close" aria-label="Close notification">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;
    
    const closeBtn = element.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      const toast = this.toasts.find(t => t.element === element);
      if (toast) this.removeToast(toast);
    });
    
    return {
      id,
      element,
      type,
      message,
      duration,
      timeout: null
    };
  }

  removeToast(toast) {
    if (!toast || !toast.element) return;
    
    if (toast.timeout) {
      clearTimeout(toast.timeout);
    }
    
    toast.element.classList.remove('show');
    
    setTimeout(() => {
      if (toast.element.parentNode) {
        toast.element.parentNode.removeChild(toast.element);
      }
      
      this.toasts = this.toasts.filter(t => t.id !== toast.id);
    }, 300);
  }

  clear() {
    this.toasts.forEach(toast => this.removeToast(toast));
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

/* ===== Command Palette System ===== */

class CommandPalette {
  constructor() {
    this.isOpen = false;
    this.selectedIndex = 0;
    this.commands = [];
    this.filteredCommands = [];
  }

  init() {
    this.setupCommands();
    this.setupEventListeners();
  }

  setupCommands() {
    this.commands = [
      {
        id: 'add-task',
        name: 'Add Task',
        description: 'Create a new task',
        action: () => window.app.addNewTask(),
        category: 'tasks',
        keywords: ['task', 'todo', 'add', 'create']
      },
      {
        id: 'focus-mode',
        name: 'Enter Focus Mode',
        description: 'Start a focused work session',
        action: () => window.app.enterFocusMode(),
        category: 'focus',
        keywords: ['focus', 'concentrate', 'work', 'deep']
      },
      {
        id: 'calm-mode',
        name: 'Calm Mode',
        description: 'Enter overwhelm recovery mode',
        action: () => window.app.enterCalmMode(),
        category: 'wellness',
        keywords: ['calm', 'overwhelm', 'stress', 'anxiety', 'breathe']
      },
      {
        id: 'quick-capture',
        name: 'Quick Capture',
        description: 'Capture a distracting thought',
        action: () => window.app.toggleQuickCapture(),
        category: 'capture',
        keywords: ['capture', 'thought', 'distraction', 'note']
      },
      {
        id: 'plan-priorities',
        name: 'Plan Daily Priorities',
        description: 'Set your top 3 priorities for today',
        action: () => window.app.planPriorities(),
        category: 'planning',
        keywords: ['priority', 'plan', 'daily', 'important']
      },
      {
        id: 'cycle-energy',
        name: 'Change Energy Level',
        description: 'Update your current energy level',
        action: () => window.app.cycleEnergyLevel(),
        category: 'settings',
        keywords: ['energy', 'level', 'mood', 'capacity']
      },
      {
        id: 'view-analytics',
        name: 'View Analytics',
        description: 'See your productivity insights',
        action: () => window.app.viewAnalytics(),
        category: 'insights',
        keywords: ['analytics', 'stats', 'insights', 'progress']
      },
      {
        id: 'export-data',
        name: 'Export Data',
        description: 'Download a backup of your data',
        action: () => window.app.exportData(),
        category: 'data',
        keywords: ['export', 'backup', 'download', 'save']
      },
      {
        id: 'settings',
        name: 'Settings',
        description: 'Customize your experience',
        action: () => window.app.toggleSettings(),
        category: 'settings',
        keywords: ['settings', 'preferences', 'customize', 'configure']
      },
      {
        id: 'shortcuts',
        name: 'Keyboard Shortcuts',
        description: 'View all keyboard shortcuts',
        action: () => window.app.shortcutManager.showShortcuts(),
        category: 'help',
        keywords: ['shortcuts', 'hotkeys', 'keyboard', 'help']
      }
    ];
  }

  setupEventListeners() {
    const input = document.getElementById('commandInput');
    if (input) {
      input.addEventListener('input', (e) => this.filterCommands(e.target.value));
      input.addEventListener('keydown', (e) => this.handleInputKeydown(e));
    }
    
    // Close on outside click
    document.addEventListener('click', (e) => {
      const palette = document.getElementById('commandPalette');
      if (palette && !palette.contains(e.target) && this.isOpen) {
        this.close();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    const palette = document.getElementById('commandPalette');
    const input = document.getElementById('commandInput');
    
    if (palette && input) {
      palette.classList.add('active');
      this.isOpen = true;
      this.selectedIndex = 0;
      
      // Clear and focus input
      input.value = '';
      input.focus();
      
      // Show all commands initially
      this.filterCommands('');
      
      if (window.app) {
        window.app.analyticsManager.trackEvent('command_palette_opened');
      }
    }
  }

  close() {
    const palette = document.getElementById('commandPalette');
    if (palette) {
      palette.classList.remove('active');
      this.isOpen = false;
      this.selectedIndex = 0;
    }
  }

  filterCommands(query) {
    const queryLower = query.toLowerCase().trim();
    
    if (!queryLower) {
      this.filteredCommands = [...this.commands];
    } else {
      this.filteredCommands = this.commands.filter(command => {
        return (
          command.name.toLowerCase().includes(queryLower) ||
          command.description.toLowerCase().includes(queryLower) ||
          command.keywords.some(keyword => keyword.includes(queryLower))
        );
      });
    }
    
    this.selectedIndex = 0;
    this.renderCommands();
  }

  renderCommands() {
    const container = document.getElementById('commandResults');
    if (!container) return;
    
    if (this.filteredCommands.length === 0) {
      container.innerHTML = `
        <div class="command-item" style="opacity: 0.6; cursor: default;">
          No commands found
        </div>
      `;
      return;
    }
    
    container.innerHTML = this.filteredCommands.map((command, index) => `
      <div class="command-item ${index === this.selectedIndex ? 'selected' : ''}" 
           data-command-id="${command.id}"
           onclick="window.app.commandPalette.executeCommand('${command.id}')">
        <div style="font-weight: 600;">${command.name}</div>
        <div style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-top: 0.25rem;">
          ${command.description}
        </div>
      </div>
    `).join('');
  }

  handleInputKeydown(event) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredCommands.length - 1);
        this.renderCommands();
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        this.renderCommands();
        break;
        
      case 'Enter':
        event.preventDefault();
        if (this.filteredCommands[this.selectedIndex]) {
          this.executeCommand(this.filteredCommands[this.selectedIndex].id);
        }
        break;
        
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
    }
  }

  executeCommand(commandId) {
    const command = this.commands.find(c => c.id === commandId);
    if (command) {
      command.action();
      this.close();
      
      if (window.app) {
        window.app.analyticsManager.trackEvent('command_executed', {
          commandId: command.id,
          commandName: command.name
        });
      }
    }
  }
}

/* ===== Settings Panel System ===== */

class SettingsPanel {
  constructor() {
    this.isOpen = false;
  }

  init() {
    this.setupEventListeners();
    this.loadSettings();
  }

  setupEventListeners() {
    // Theme selection
    document.querySelectorAll('.theme-option').forEach(option => {
      option.addEventListener('click', () => {
        const theme = option.dataset.theme;
        this.applyTheme(theme);
      });
    });
    
    // Settings checkboxes
    const checkboxes = ['reducedMotion', 'keyboardHints', 'soundEffects'];
    checkboxes.forEach(id => {
      const checkbox = document.getElementById(id);
      if (checkbox) {
        checkbox.addEventListener('change', () => this.updateSetting(id, checkbox.checked));
      }
    });
    
    // Settings selects
    const selects = ['focusDuration', 'breakInterval'];
    selects.forEach(id => {
      const select = document.getElementById(id);
      if (select) {
        select.addEventListener('change', () => this.updateSetting(id, select.value));
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    const panel = document.getElementById('settingsPanel');
    if (panel) {
      panel.classList.add('active');
      this.isOpen = true;
      
      if (window.app) {
        window.app.analyticsManager.trackEvent('settings_opened');
      }
    }
  }

  close() {
    const panel = document.getElementById('settingsPanel');
    if (panel) {
      panel.classList.remove('active');
      this.isOpen = false;
    }
  }

  loadSettings() {
    if (!window.app) return;
    
    const settings = window.app.stateManager.state.settings;
    
    // Load theme
    this.applyTheme(settings.theme);
    
    // Load checkboxes
    const reducedMotion = document.getElementById('reducedMotion');
    if (reducedMotion) reducedMotion.checked = settings.reducedMotion;
    
    const keyboardHints = document.getElementById('keyboardHints');
    if (keyboardHints) keyboardHints.checked = settings.keyboardHints;
    
    const soundEffects = document.getElementById('soundEffects');
    if (soundEffects) soundEffects.checked = settings.soundEffects;
    
    // Load selects
    const focusDuration = document.getElementById('focusDuration');
    if (focusDuration) focusDuration.value = settings.focusDuration;
    
    const breakInterval = document.getElementById('breakInterval');
    if (breakInterval) breakInterval.value = settings.breakInterval;
    
    // Apply reduced motion if enabled
    if (settings.reducedMotion) {
      document.body.classList.add('reduced-motion');
    }
  }

  applyTheme(themeName) {
    if (window.app) {
      window.app.applyTheme(themeName);
    }
  }

  updateSetting(key, value) {
    if (!window.app) return;
    
    const updates = { [key]: value };
    window.app.stateManager.updateSettings(updates);
    
    // Apply special settings immediately
    if (key === 'reducedMotion') {
      document.body.classList.toggle('reduced-motion', value);
    }
    
    window.app.analyticsManager.trackEvent('setting_changed', { key, value });
  }
}

/* ===== Accessibility Manager ===== */

class AccessibilityManager {
  constructor() {
    this.reducedMotion = false;
    this.keyboardNavigation = true;
    this.focusVisible = true;
  }

  init() {
    this.detectMotionPreference();
    this.setupFocusManagement();
    this.setupScreenReaderSupport();
    this.setupKeyboardTraps();
  }

  detectMotionPreference() {
    // Detect system preference for reduced motion
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotion = mediaQuery.matches;
      
      if (this.reducedMotion) {
        document.body.classList.add('reduced-motion');
      }
      
      // Listen for changes
      mediaQuery.addListener((mq) => {
        this.reducedMotion = mq.matches;
        document.body.classList.toggle('reduced-motion', mq.matches);
      });
    }
  }

  setupFocusManagement() {
    // Ensure focus is always visible for keyboard users
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  setupScreenReaderSupport() {
    // Announce important state changes to screen readers
    const announcer = document.createElement('div');
    announcer.id = 'sr-announcer';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    document.body.appendChild(announcer);
    
    this.announcer = announcer;
  }

  announce(message, priority = 'polite') {
    if (this.announcer) {
      this.announcer.setAttribute('aria-live', priority);
      this.announcer.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        this.announcer.textContent = '';
      }, 1000);
    }
  }

  setupKeyboardTraps() {
    // Trap focus in modals and overlays
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const modal = document.querySelector('.modal.active, .focus-overlay.active, .calm-overlay.active');
        if (modal) {
          this.trapFocus(e, modal);
        }
      }
    });
  }

  trapFocus(event, container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  // High contrast mode detection
  detectHighContrast() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(forced-colors: active)');
      if (mediaQuery.matches) {
        document.body.classList.add('high-contrast-mode');
      }
      
      mediaQuery.addListener((mq) => {
        document.body.classList.toggle('high-contrast-mode', mq.matches);
      });
    }
  }
}

/* ===== Performance Monitor ===== */

class PerformanceMonitor {
  constructor() {
    this.marks = new Map();
    this.measures = new Map();
    this.enabled = true;
  }

  init() {
    this.observePerformance();
    this.monitorMemory();
  }

  mark(name) {
    if (this.enabled && window.performance && window.performance.mark) {
      window.performance.mark(name);
      this.marks.set(name, window.performance.now());
    }
  }

  measure(name, startMark, endMark) {
    if (this.enabled && window.performance && window.performance.measure) {
      try {
        window.performance.measure(name, startMark, endMark);
        const measure = window.performance.getEntriesByName(name, 'measure')[0];
        this.measures.set(name, measure.duration);
        
        // Log slow operations
        if (measure.duration > 100) {
          console.warn(`Slow operation detected: ${name} took ${measure.duration.toFixed(2)}ms`);
        }
      } catch (error) {
        console.warn('Performance measurement failed:', error);
      }
    }
  }

  observePerformance() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure' && entry.duration > 16) {
            // Log operations that might cause frame drops
            console.log(`Performance: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
          }
        }
      });
      
      observer.observe({ entryTypes: ['measure'] });
    }
  }

  monitorMemory() {
    if ('memory' in window.performance) {
      setInterval(() => {
        const memory = window.performance.memory;
        const usage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        
        if (usage > 80) {
          console.warn(`High memory usage: ${usage.toFixed(1)}%`);
          this.suggestCleanup();
        }
      }, 30000); // Check every 30 seconds
    }
  }

  suggestCleanup() {
    // Suggest cleanup actions for high memory usage
    if (window.app) {
      window.app.stateManager.cleanupOldAnalytics();
      
      // Limit captured thoughts if too many
      if (window.app.stateManager.state.capturedThoughts.length > 100) {
        window.app.stateManager.state.capturedThoughts = 
          window.app.stateManager.state.capturedThoughts.slice(-50);
      }
    }
  }

  getStats() {
    return {
      marks: Object.fromEntries(this.marks),
      measures: Object.fromEntries(this.measures)
    };
  }
}

/* ===== Global Functions for HTML Event Handlers ===== */

// These functions are called directly from HTML onclick attributes
window.toggleShortcutsOverlay = function() {
  if (window.app && window.app.shortcutManager) {
    window.app.shortcutManager.toggleShortcutsOverlay();
  }
};

window.toggleFabMenu = function() {
  const fabContainer = document.querySelector('.fab-container');
  if (fabContainer) {
    fabContainer.classList.toggle('open');
  }
};

window.focusOnPriority = function(index) {
  if (window.app) {
    window.app.focusOnPriority(index);
  }
};

window.focusOnTask = function(taskId) {
  if (window.app) {
    window.app.focusOnTask(taskId);
  }
};

window.updateTaskEnergy = function(taskId, energy) {
  if (window.app) {
    window.app.updateTaskEnergy(taskId, energy);
  }
};

window.deleteTask = function(taskId) {
  if (window.app) {
    window.app.deleteTask(taskId);
  }
};

window.filterTasks = function(filter) {
  if (window.app) {
    window.app.filterTasks(filter);
  }
};

window.filterByEnergy = function() {
  if (window.app) {
    window.app.filterByEnergy();
  }
};

window.addTask = function() {
  if (window.app) {
    window.app.addTask();
  }
};

window.addTimeBlock = function() {
  if (window.app) {
    window.app.addTimeBlock();
  }
};

window.editTimeBlock = function(blockId) {
  if (window.app) {
    window.app.editTimeBlock(blockId);
  }
};

window.deleteTimeBlock = function(blockId) {
  if (window.app) {
    window.app.deleteTimeBlock(blockId);
  }
};

window.startTimeBlockFocus = function(blockId) {
  if (window.app) {
    window.app.startTimeBlockFocus(blockId);
  }
};

window.saveCapturedThought = function() {
  if (window.app) {
    window.app.saveCapturedThought();
  }
};

window.clearThoughts = function() {
  if (window.app) {
    window.app.clearThoughts();
  }
};

window.planPriorities = function() {
  if (window.app) {
    window.app.planPriorities();
  }
};

window.cycleEnergyLevel = function() {
  if (window.app) {
    window.app.cycleEnergyLevel();
  }
};

window.enterFocusMode = function() {
  if (window.app) {
    window.app.enterFocusMode();
  }
};

window.enterCalmMode = function() {
  if (window.app) {
    window.app.enterCalmMode();
  }
};

window.exitCalmMode = function() {
  if (window.app) {
    window.app.exitCalmMode();
  }
};

window.completeCalmAction = function() {
  if (window.app) {
    window.app.completeCalmAction();
  }
};

window.getNextCalmAction = function() {
  if (window.app) {
    window.app.getNextCalmAction();
  }
};

window.startFocusSession = function() {
  if (window.app && window.app.focusManager) {
    window.app.focusManager.beginFocusSession();
  }
};

window.showFocusHelp = function() {
  if (window.app && window.app.focusManager) {
    window.app.focusManager.showFocusHelp();
  }
};

window.exitFocusMode = function() {
  if (window.app && window.app.focusManager) {
    window.app.focusManager.exitFocusMode();
  }
};

window.toggleFocusTimer = function() {
  if (window.app && window.app.focusManager) {
    window.app.focusManager.toggleTimer();
  }
};

window.resetFocusTimer = function() {
  if (window.app && window.app.focusManager) {
    window.app.focusManager.resetTimer();
  }
};

window.toggleQuickCapture = function() {
  if (window.app) {
    window.app.toggleQuickCapture();
  }
};

window.toggleCommandPalette = function() {
  if (window.app && window.app.commandPalette) {
    window.app.commandPalette.toggle();
  }
};

window.toggleSettings = function() {
  if (window.app) {
    window.app.toggleSettings();
  }
};

window.viewAnalytics = function() {
  if (window.app) {
    window.app.viewAnalytics();
  }
};

window.closeAnalytics = function() {
  const modal = document.getElementById('analyticsModal');
  if (modal) {
    modal.classList.remove('active');
  }
};

window.exportData = function() {
  if (window.app) {
    window.app.exportData();
  }
};

window.importData = function(event) {
  if (window.app) {
    window.app.importData(event);
  }
};

window.resetAllData = function() {
  if (window.app) {
    window.app.resetAllData();
  }
};

window.showAbout = function() {
  if (window.app) {
    window.app.toastManager.show('3e Daily Command Center v3.0 - Built specifically for gifted, ADHD, and ASD minds 🧠', 'info', 6000);
  }
};

/* ===== Application Initialization ===== */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the main application
  window.app = new ThreeEPlannerApp();
  
  // Setup additional event listeners for HTML elements
  setupGlobalEventListeners();
});

function setupGlobalEventListeners() {
  // Task input enter key
  const taskInput = document.getElementById('taskInput');
  if (taskInput) {
    taskInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        window.app.addTask();
      }
    });
  }
  
  // Capture input enter key
  const captureInput = document.getElementById('captureInput');
  if (captureInput) {
    captureInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        window.app.saveCapturedThought();
      } else if (e.key === 'Escape') {
        window.app.toggleQuickCapture();
      }
    });
  }
  
  // Close modals on backdrop click
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal') || e.target.classList.contains('focus-overlay') || e.target.classList.contains('calm-overlay')) {
      const modal = e.target;
      if (modal.id === 'focusOverlay') window.app.focusManager.exitFocusMode();
      else if (modal.id === 'calmMode') window.app.exitCalmMode();
      else if (modal.id === 'analyticsModal') window.closeAnalytics();
      else modal.classList.remove('active');
    }
  });
  
  // FAB menu close on outside click
  document.addEventListener('click', function(e) {
    const fabContainer = document.querySelector('.fab-container');
    const isClickInsideFab = fabContainer && fabContainer.contains(e.target);
    
    if (!isClickInsideFab && fabContainer && fabContainer.classList.contains('open')) {
      fabContainer.classList.remove('open');
    }
  });
}

/* ===== Service Worker Registration (if sw.js exists) ===== */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('ServiceWorker registration successful:', registration);
      })
      .catch(function(error) {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}

/* ===== Export for Module Systems ===== */

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ThreeEPlannerApp,
    StateManager,
    FocusManager,
    ShortcutManager,
    AnalyticsManager,
    ToastManager,
    CommandPalette,
    SettingsPanel,
    AccessibilityManager,
    PerformanceMonitor
  };
}
window.setEnergyLevel = function(energy) {
  if (window.app) {
    window.app.setEnergyLevel(energy);
  }
};
