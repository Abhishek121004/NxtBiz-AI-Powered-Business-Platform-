export const resourceConfigs = {
  users: {
    title: 'Users',
    endpoint: '/users',
    fields: [
      { name: 'name', label: 'Name', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'password', label: 'Password', type: 'password', createOnly: true },
      { name: 'role', label: 'Role', type: 'select', options: ['Admin', 'Manager', 'Employee', 'Viewer'] },
      { name: 'active', label: 'Active', type: 'checkbox' }
    ]
  },
  customers: {
    title: 'Customers',
    endpoint: '/customers',
    detailBase: '/customers',
    fields: [
      { name: 'name', label: 'Name', required: true },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Phone' },
      { name: 'company', label: 'Company' },
      { name: 'tags', label: 'Tags', type: 'tags' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
      { name: 'healthScore', label: 'Health Score', type: 'number' }
    ]
  },
  meetings: {
    title: 'Meetings',
    endpoint: '/meetings',
    fields: [
      { name: 'title', label: 'Title', required: true },
      { name: 'attendees', label: 'Attendees', type: 'tags' },
      { name: 'startTime', label: 'Start Time', type: 'datetime-local', required: true },
      { name: 'endTime', label: 'End Time', type: 'datetime-local' },
      { name: 'status', label: 'Status', type: 'select', options: ['scheduled', 'completed', 'cancelled'] },
      { name: 'customerId', label: 'Customer ID' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  invoices: {
    title: 'Invoices',
    endpoint: '/invoices',
    fields: [
      { name: 'customerId', label: 'Customer ID', required: true },
      { name: 'amount', label: 'Amount', type: 'number', required: true },
      { name: 'dueDate', label: 'Due Date', type: 'date', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['draft', 'sent', 'paid', 'overdue'] }
    ]
  },
  tickets: {
    title: 'Tickets',
    endpoint: '/tickets',
    fields: [
      { name: 'customerId', label: 'Customer ID' },
      { name: 'priority', label: 'Priority', type: 'select', options: ['low', 'medium', 'high', 'critical'] },
      { name: 'issue', label: 'Issue', type: 'textarea', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['open', 'in_progress', 'resolved', 'closed'] },
      { name: 'assignedTo', label: 'Assigned User ID' },
      { name: 'resolution', label: 'Resolution', type: 'textarea' }
    ]
  },
  crm: {
    title: 'CRM Timeline',
    endpoint: '/crm',
    createEndpoint: '/crm/activity',
    fields: [
      { name: 'customerId', label: 'Customer ID' },
      { name: 'type', label: 'Type', type: 'select', options: ['note', 'call', 'email', 'meeting', 'task'] },
      { name: 'title', label: 'Title', required: true },
      { name: 'body', label: 'Body', type: 'textarea' }
    ],
    readonlyRows: true
  }
};
