<script>
  import { uiActions, user } from '../stores/index.js';

  let username = '';
  
  user.subscribe(u => {
    username = u.username;
  });
</script>

<header class="header">
  <div class="header-content">
    <div class="header-left">
      <button class="sidebar-toggle" on:click={uiActions.toggleSidebar}>
        ☰
      </button>
      <h1 class="app-title">Contract Management Platform</h1>
    </div>
    
    <div class="header-right">
      <span class="user-info">Welcome, {username}</span>
      <button class="btn btn-secondary">Settings</button>
    </div>
  </div>
</header>

<style>
  .header {
    background: #fff;
    border-bottom: 1px solid #e9ecef;
    padding: 0 1rem;
    height: 60px;
    display: flex;
    align-items: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .sidebar-toggle {
    background: none;
    border: none;
    font-size: 1.2rem;
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 4px;
  }

  .sidebar-toggle:hover {
    background: #f8f9fa;
  }

  .app-title {
    margin: 0;
    font-size: 1.25rem;
    color: #333;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .user-info {
    color: #6c757d;
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    .app-title {
      font-size: 1rem;
    }
    
    .header-right {
      gap: 0.5rem;
    }
    
    .user-info {
      display: none;
    }
  }
</style>
