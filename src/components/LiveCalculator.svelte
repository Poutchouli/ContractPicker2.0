<script>
  export let totals;

  $: {
    // Ensure totals is reactive and has default values
    totals = totals || {
      subtotal: 0,
      discountAmount: 0,
      finalOneOffTotal: 0,
      monthlyRecurring: 0,
      yearlyRecurring: 0,
      totalFirstYear: 0
    };
  }
</script>

<div class="live-calculator">
  <div class="calculator-header">
    <h3>💰 Live Total Calculator</h3>
    <p>Updates automatically as you edit</p>
  </div>
  
  <div class="calculator-content">
    <!-- One-time Costs -->
    <div class="calculation-section">
      <h4>One-time Costs</h4>
      <div class="calc-row">
        <span>Subtotal:</span>
        <span class="amount">${totals.subtotal.toFixed(2)}</span>
      </div>
      {#if totals.discountAmount > 0}
        <div class="calc-row discount">
          <span>Total Discounts:</span>
          <span class="amount">-${totals.discountAmount.toFixed(2)}</span>
        </div>
      {/if}
      <div class="calc-row total">
        <span>One-time Total:</span>
        <span class="amount">${totals.finalOneOffTotal.toFixed(2)}</span>
      </div>
    </div>

    <!-- Recurring Costs -->
    {#if totals.monthlyRecurring > 0 || totals.yearlyRecurring > 0}
      <div class="calculation-section">
        <h4>Recurring Costs</h4>
        {#if totals.monthlyRecurring > 0}
          <div class="calc-row">
            <span>Monthly:</span>
            <span class="amount">${totals.monthlyRecurring.toFixed(2)}/mo</span>
          </div>
        {/if}
        {#if totals.yearlyRecurring > 0}
          <div class="calc-row">
            <span>Yearly:</span>
            <span class="amount">${totals.yearlyRecurring.toFixed(2)}/yr</span>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Grand Total -->
    <div class="calculation-section grand-total">
      <div class="calc-row">
        <span>First Year Total:</span>
        <span class="amount grand">${totals.totalFirstYear.toFixed(2)}</span>
      </div>
      <div class="breakdown">
        <small>
          One-time: ${totals.finalOneOffTotal.toFixed(2)}
          {#if totals.monthlyRecurring > 0}
            + Monthly: ${(totals.monthlyRecurring * 12).toFixed(2)}
          {/if}
          {#if totals.yearlyRecurring > 0}
            + Yearly: ${totals.yearlyRecurring.toFixed(2)}
          {/if}
        </small>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-label">Line Items</div>
        <div class="stat-value">{totals.lineItemCount || 0}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Discounts</div>
        <div class="stat-value">{totals.discountCount || 0}</div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <button class="btn btn-primary btn-full">
        Export Contract
      </button>
      <button class="btn btn-secondary btn-full">
        Save Draft
      </button>
    </div>
  </div>
</div>

<style>
  .live-calculator {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: sticky;
    top: 2rem;
  }

  .calculator-header {
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;
    padding: 1.5rem;
    text-align: center;
  }

  .calculator-header h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
  }

  .calculator-header p {
    margin: 0;
    opacity: 0.9;
    font-size: 0.9rem;
  }

  .calculator-content {
    padding: 1.5rem;
  }

  .calculation-section {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #e9ecef;
  }

  .calculation-section:last-of-type {
    border-bottom: none;
    margin-bottom: 1rem;
  }

  .calculation-section h4 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    color: #495057;
    font-weight: 600;
  }

  .calc-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    font-size: 0.95rem;
  }

  .calc-row.discount {
    color: #dc3545;
  }

  .calc-row.total {
    font-weight: 600;
    border-top: 1px solid #e9ecef;
    padding-top: 0.75rem;
    margin-top: 0.5rem;
  }

  .amount {
    font-weight: 600;
    font-family: 'Courier New', monospace;
  }

  .amount.grand {
    color: #28a745;
    font-size: 1.25rem;
  }

  .grand-total {
    background: #f8f9fa;
    margin: 0 -1.5rem 2rem -1.5rem;
    padding: 1.5rem;
    border-radius: 6px;
  }

  .breakdown {
    margin-top: 0.5rem;
    text-align: center;
  }

  .breakdown small {
    color: #6c757d;
    font-size: 0.8rem;
    line-height: 1.3;
  }

  .stats-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 6px;
    text-align: center;
  }

  .stat-label {
    font-size: 0.8rem;
    color: #6c757d;
    margin-bottom: 0.25rem;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: #007bff;
  }

  .quick-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn-full {
    width: 100%;
    padding: 0.75rem;
    font-weight: 500;
  }

  /* Pulsing animation for real-time updates */
  .live-calculator {
    animation: pulse 0.3s ease-in-out;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }

  /* Mobile responsive */
  @media (max-width: 1024px) {
    .live-calculator {
      position: static;
    }
  }
</style>
