<script>
  import { uiActions, uiState } from '../stores/index.js';

  let currentView = 'dashboard';
  
  uiState.subscribe(state => {
    currentView = state.currentView;
  });

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'contract-editor', label: 'Create Contract', icon: '📝' },
    { id: 'template-creator', label: 'Template Creator', icon: '🎯' },
    { id: 'comparison', label: 'Compare Contracts', icon: '🔍' }
  ];
</script>

<aside class="sidebar">
  <div class="sidebar-content">
    <nav class="sidebar-nav">
      <ul class="nav-list">
        {#each menuItems as item}
          <li class="nav-item">
            <button 
              class="nav-link" 
              class:active={currentView === item.id}
              on:click={() => uiActions.setView(item.id)}
            >
              <span class="nav-icon">{item.icon}</span>
              <span class="nav-label">{item.label}</span>
            </button>
          </li>
        {/each}
      </ul>
    </nav>
    
    <div class="sidebar-footer">
      <div class="help-section">
        <h4>Quick Start</h4>
        <p>Create your first contract by clicking "Create Contract" above.</p>
      </div>
    </div>
  </div>
</aside>

<style>
  .sidebar {
    background: #fff;
    border-right: 1px solid #e9ecef;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .sidebar-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1rem;
  }

  .sidebar-nav {
    flex: 1;
  }

  .nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .nav-item {
    margin-bottom: 0.25rem;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    background: none;
    border-radius: 6px;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s ease;
    color: #6c757d;
  }

  .nav-link:hover {
    background: #f8f9fa;
    color: #495057;
  }

  .nav-link.active {
    background: #007bff;
    color: white;
  }

  .nav-icon {
    font-size: 1.1rem;
    width: 20px;
    text-align: center;
  }

  .nav-label {
    font-weight: 500;
  }

  .sidebar-footer {
    border-top: 1px solid #e9ecef;
    padding-top: 1rem;
    margin-top: 1rem;
  }

  .help-section h4 {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    color: #495057;
  }

  .help-section p {
    margin: 0;
    font-size: 0.8rem;
    color: #6c757d;
    line-height: 1.4;
  }
</style>
