<script>
  import { onMount } from 'svelte';
  import { uiState, user } from './stores/index.js';
  import Dashboard from './components/Dashboard.svelte';
  import ContractEditor from './components/ContractEditor.svelte';
  import Sidebar from './components/Sidebar.svelte';
  import Header from './components/Header.svelte';
  import Notifications from './components/Notifications.svelte';

  let currentView = 'dashboard';
  let sidebarOpen = true;

  // Subscribe to UI state
  uiState.subscribe(state => {
    currentView = state.currentView;
    sidebarOpen = state.sidebarOpen;
  });

  onMount(() => {
    // For MVP, simulate user authentication
    user.set({
      isAuthenticated: true,
      username: 'demo@example.com',
      contracts: []
    });
  });
</script>

<main class="app">
  <Header />
  <Notifications />
  
  <div class="app-layout">
    {#if sidebarOpen}
      <Sidebar />
    {/if}
    
    <div class="main-content" class:full-width={!sidebarOpen}>
      {#if currentView === 'dashboard'}
        <Dashboard />
      {:else if currentView === 'contract-editor'}
        <ContractEditor />
      {:else}
        <div class="placeholder">
          <h2>View Not Implemented</h2>
          <p>The {currentView} view is coming soon!</p>
        </div>
      {/if}
    </div>
  </div>
</main>

<style>
  .app {
    min-height: 100vh;
    background-color: #f8f9fa;
  }

  .app-layout {
    display: grid;
    grid-template-columns: 250px 1fr;
    min-height: calc(100vh - 60px);
  }

  .app-layout:has(.sidebar) {
    grid-template-columns: 250px 1fr;
  }

  .main-content {
    padding: 2rem;
    overflow-x: auto;
    transition: margin-left 0.3s ease;
  }

  .main-content.full-width {
    grid-column: 1 / -1;
  }

  .placeholder {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    .app-layout {
      grid-template-columns: 1fr;
    }
    
    .main-content {
      padding: 1rem;
    }
  }
</style>
