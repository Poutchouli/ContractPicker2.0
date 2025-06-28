<script>
  import { onMount } from 'svelte';
  import { uiActions, user, contractActions } from '../stores/index.js';
  
  let contracts = [];
  let recentActivity = [
    { action: 'Created', contract: 'Web Development Contract', date: '2025-06-27' },
    { action: 'Updated', contract: 'Consulting Agreement', date: '2025-06-26' },
    { action: 'Exported', contract: 'SaaS License', date: '2025-06-25' }
  ];

  user.subscribe(u => {
    contracts = u.contracts || [];
  });

  async function loadContract(contractId) {
    try {
      const result = await contractActions.loadFromBackend(contractId);
      if (result.success) {
        uiActions.setView('contract-editor');
        uiActions.addNotification('Contract loaded successfully', 'success');
      } else {
        uiActions.addNotification(`Failed to load contract: ${result.error}`, 'error');
      }
    } catch (error) {
      uiActions.addNotification('Error loading contract', 'error');
      console.error('Load error:', error);
    }
  }

  async function exportContract(contract) {
    try {
      // Create a downloadable JSON file
      const contractJson = JSON.stringify(contract, null, 2);
      const blob = new Blob([contractJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create temporary download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `${contract.contractMetadata?.contractName || 'contract'}-${contract.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      uiActions.addNotification('Contract exported successfully', 'success');
    } catch (error) {
      uiActions.addNotification('Error exporting contract', 'error');
      console.error('Export error:', error);
    }
  }

  function createNewContract() {
    uiActions.setView('contract-editor');
    uiActions.addNotification('Starting new contract creation', 'info');
  }

  function openTemplate() {
    uiActions.setView('template-creator');
  }

  function openComparison() {
    uiActions.setView('comparison');
  }

  onMount(async () => {
    // Load contracts from backend
    try {
      const result = await contractActions.getAllContracts();
      if (result.success) {
        user.update(u => ({
          ...u,
          contracts: result.data
        }));
      } else {
        // Fallback to demo data if backend is not available
        console.warn('Backend not available, using demo data:', result.error);
        user.update(u => ({
          ...u,
          contracts: [
            { 
              id: '1', 
              contractMetadata: {
                contractName: 'Web Development Contract',
                clientName: 'Acme Corp',
                effectiveDate: '2025-06-27'
              },
              total: 15000, 
              status: 'Draft',
              lastModified: '2025-06-27'
            },
            { 
              id: '2', 
              contractMetadata: {
                contractName: 'Consulting Agreement',
                clientName: 'TechStart Inc',
                effectiveDate: '2025-06-26'
              },
              total: 8500, 
              status: 'Active',
              lastModified: '2025-06-26'
            }
          ]
        }));
      }
    } catch (error) {
      console.error('Error loading contracts:', error);
      uiActions.addNotification('Could not load contracts from server', 'warning');
    }
  });
</script>

<div class="dashboard">
  <div class="dashboard-header">
    <h2>Contract Dashboard</h2>
    <p>Manage your contracts and templates</p>
  </div>

  <!-- Quick Actions -->
  <div class="quick-actions">
    <button class="action-card" on:click={createNewContract} type="button">
      <div class="action-icon">📝</div>
      <h3>Create New Contract</h3>
      <p>Start with our smart contract builder</p>
    </button>
    
    <button class="action-card" on:click={openTemplate} type="button">
      <div class="action-icon">🎯</div>
      <h3>Design Template</h3>
      <p>Create reusable contract templates</p>
    </button>
    
    <button class="action-card" on:click={openComparison} type="button">
      <div class="action-icon">🔍</div>
      <h3>Compare Contracts</h3>
      <p>Analyze differences between contracts</p>
    </button>
  </div>

  <!-- Stats Overview -->
  <div class="stats-grid">
    <div class="stat-card">
      <h4>Total Contracts</h4>
      <div class="stat-value">{contracts.length}</div>
    </div>
    <div class="stat-card">
      <h4>Active Contracts</h4>
      <div class="stat-value">{contracts.filter(c => c.status === 'Active').length}</div>
    </div>
    <div class="stat-card">
      <h4>Total Value</h4>
      <div class="stat-value">${contracts.reduce((sum, c) => sum + c.total, 0).toLocaleString()}</div>
    </div>
    <div class="stat-card">
      <h4>Draft Contracts</h4>
      <div class="stat-value">{contracts.filter(c => c.status === 'Draft').length}</div>
    </div>
  </div>

  <!-- Recent Contracts -->
  <div class="section">
    <h3>Recent Contracts</h3>
    {#if contracts.length > 0}
      <div class="contracts-table">
        <div class="table-header">
          <div>Contract Name</div>
          <div>Client</div>
          <div>Total Value</div>
          <div>Status</div>
          <div>Last Modified</div>
          <div>Actions</div>
        </div>
        {#each contracts as contract}
          <div class="table-row">
            <div class="contract-name">{contract.contractMetadata?.contractName || contract.name || 'Untitled Contract'}</div>
            <div>{contract.contractMetadata?.clientName || contract.client || 'Unknown Client'}</div>
            <div class="contract-value">${contract.total.toLocaleString()}</div>
            <div>
              <span class="status status-{contract.status.toLowerCase()}">{contract.status}</span>
            </div>
            <div>{contract.lastModified}</div>
            <div class="actions">
              <button class="btn-small btn-primary" on:click={() => loadContract(contract.id)}>Edit</button>
              <button class="btn-small btn-secondary" on:click={() => exportContract(contract)}>Export</button>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="empty-state">
        <p>No contracts yet. Create your first contract to get started!</p>
        <button class="btn btn-primary" on:click={createNewContract}>
          Create Your First Contract
        </button>
      </div>
    {/if}
  </div>

  <!-- Recent Activity -->
  <div class="section">
    <h3>Recent Activity</h3>
    <div class="activity-list">
      {#each recentActivity as activity}
        <div class="activity-item">
          <div class="activity-icon">📄</div>
          <div class="activity-content">
            <div class="activity-text">
              <strong>{activity.action}</strong> {activity.contract}
            </div>
            <div class="activity-date">{activity.date}</div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
  }

  .dashboard-header {
    margin-bottom: 2rem;
  }

  .dashboard-header h2 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }

  .dashboard-header p {
    margin: 0;
    color: #6c757d;
  }

  .quick-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .action-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    border: none;
    width: 100%;
    font-family: inherit;
  }

  .action-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .action-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .action-card h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }

  .action-card p {
    margin: 0;
    color: #6c757d;
    font-size: 0.9rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .stat-card h4 {
    margin: 0 0 1rem 0;
    color: #6c757d;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: #007bff;
  }

  .section {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }

  .section h3 {
    margin: 0 0 1.5rem 0;
    color: #333;
  }

  .contracts-table {
    display: grid;
    gap: 0.5rem;
  }

  .table-header,
  .table-row {
    display: grid;
    grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr 1.5fr;
    gap: 1rem;
    align-items: center;
    padding: 0.75rem 0;
  }

  .table-header {
    font-weight: 600;
    color: #495057;
    border-bottom: 2px solid #e9ecef;
  }

  .table-row {
    border-bottom: 1px solid #f8f9fa;
  }

  .table-row:hover {
    background: #f8f9fa;
  }

  .contract-name {
    font-weight: 500;
    color: #007bff;
  }

  .contract-value {
    font-weight: 600;
    color: #28a745;
  }

  .status {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .status-active {
    background: #d4edda;
    color: #155724;
  }

  .status-draft {
    background: #fff3cd;
    color: #856404;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
  }

  .btn-small {
    padding: 0.25rem 0.75rem;
    font-size: 0.8rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .btn-small.btn-primary {
    background: #007bff;
    color: white;
  }

  .btn-small.btn-secondary {
    background: #6c757d;
    color: white;
  }

  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: #6c757d;
  }

  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .activity-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 6px;
  }

  .activity-icon {
    font-size: 1.2rem;
  }

  .activity-content {
    flex: 1;
  }

  .activity-text {
    margin-bottom: 0.25rem;
  }

  .activity-date {
    font-size: 0.8rem;
    color: #6c757d;
  }

  @media (max-width: 768px) {
    .quick-actions {
      grid-template-columns: 1fr;
    }
    
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .table-header,
    .table-row {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }
    
    .table-header {
      display: none;
    }
  }
</style>
