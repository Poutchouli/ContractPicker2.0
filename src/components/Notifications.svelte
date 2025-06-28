<script>
  import { uiState } from '../stores/index.js';

  let notifications = [];
  
  uiState.subscribe(state => {
    notifications = state.notifications;
  });
</script>

{#if notifications.length > 0}
  <div class="notifications">
    {#each notifications as notification (notification.id)}
      <div class="notification notification-{notification.type}">
        <span>{notification.message}</span>
        <button class="close-btn" on:click={() => {
          uiState.update(state => ({
            ...state,
            notifications: state.notifications.filter(n => n.id !== notification.id)
          }));
        }}>×</button>
      </div>
    {/each}
  </div>
{/if}

<style>
  .notifications {
    position: fixed;
    top: 80px;
    right: 1rem;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 400px;
  }

  .notification {
    padding: 1rem;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: space-between;
    align-items: center;
    animation: slideIn 0.3s ease-out;
  }

  .notification-info {
    background: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
  }

  .notification-success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .notification-warning {
    background: #fff3cd;
    color: #856404;
    border: 1px solid #ffeaa7;
  }

  .notification-error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    margin-left: 1rem;
    opacity: 0.7;
  }

  .close-btn:hover {
    opacity: 1;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
</style>
