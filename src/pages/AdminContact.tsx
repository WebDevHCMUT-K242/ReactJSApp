import { useState, useEffect } from 'react';

type ContactStatus = 'unread' | 'read' | 'replied';

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  status: ContactStatus;
  submitted_at: string;
}

interface PaginationInfo {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export default function AdminContact() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 0
  });
  const [statusFilter, setStatusFilter] = useState<ContactStatus | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.currentPage.toString(),
        per_page: pagination.perPage.toString(),
      });
      
      if (statusFilter) {
        queryParams.append('status', statusFilter);
      }
      
      const response = await fetch(`/api/admin/contacts.php?${queryParams.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setContacts(data.data);
        setPagination(data.pagination);
      } else {
        setError('Failed to load contacts: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      setError('Error fetching contacts: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [pagination.currentPage, statusFilter]);

  const updateContactStatus = async (id: number, status: ContactStatus) => {
    try {
      const response = await fetch('/api/admin/contacts.php', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setContacts(contacts.map(contact => 
          contact.id === id ? { ...contact, status } : contact
        ));
        showNotification('Status updated successfully', 'success');
        
        if (selectedContact && selectedContact.id === id) {
          setSelectedContact({ ...selectedContact, status });
        }
      } else {
        showNotification('Failed to update status: ' + (data.error || 'Unknown error'), 'error');
      }
    } catch (err) {
      showNotification('Error updating status: ' + (err instanceof Error ? err.message : String(err)), 'error');
    }
  };

  const deleteContact = async () => {
    if (!selectedContact) return;
    
    try {
      const response = await fetch('/api/admin/contacts.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: selectedContact.id }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setContacts(contacts.filter(contact => contact.id !== selectedContact.id));
        showNotification('Contact deleted successfully', 'success');
        setShowDeleteModal(false);
        setSelectedContact(null);
        
        if (contacts.length === 1 && pagination.currentPage > 1) {
          setPagination(prev => ({
            ...prev,
            currentPage: prev.currentPage - 1
          }));
        } else {
          fetchContacts();
        }
      } else {
        showNotification('Failed to delete contact: ' + (data.error || 'Unknown error'), 'error');
      }
    } catch (err) {
      showNotification('Error deleting contact: ' + (err instanceof Error ? err.message : String(err)), 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const StatusBadge = ({ status }: { status: ContactStatus }) => {
    const badgeClasses = {
      unread: 'bg-yellow-100 text-yellow-800',
      read: 'bg-blue-100 text-blue-800',
      replied: 'bg-green-100 text-green-800'
    };
    
    const statusLabels = {
      unread: 'Chưa đọc',
      read: 'Đã đọc',
      replied: 'Đã phản hồi'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badgeClasses[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {notification && (
        <div 
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {notification.message}
        </div>
      )}
      
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Manage contact list</h1>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <label className="mr-2 text-sm font-medium text-gray-700">Filter by status:</label>
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => setStatusFilter(null)}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                    statusFilter === null 
                      ? 'bg-blue-100 text-blue-700 border-blue-300' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('unread')}
                  className={`px-4 py-2 text-sm font-medium border-t border-b ${
                    statusFilter === 'unread' 
                      ? 'bg-yellow-100 text-yellow-700 border-yellow-300' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Unread
                </button>
                <button
                  onClick={() => setStatusFilter('read')}
                  className={`px-4 py-2 text-sm font-medium border-t border-b ${
                    statusFilter === 'read' 
                      ? 'bg-blue-100 text-blue-700 border-blue-300' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Read
                </button>
                <button
                  onClick={() => setStatusFilter('replied')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md border ${
                    statusFilter === 'replied' 
                      ? 'bg-green-100 text-green-700 border-green-300' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Responded
                </button>
              </div>
            </div>
            
            <div>
              <span className="text-sm text-gray-500">
                {pagination.totalItems} contact
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden rounded-lg">
          {loading ? (
            <div className="p-10 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading data...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-600">
              <p>{error}</p>
              <button 
                onClick={fetchContacts}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          ) : contacts.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No contact {statusFilter ? `với trạng thái ${statusFilter}` : ''}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Content
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <tr 
                      key={contact.id} 
                      className={`${contact.status === 'unread' ? 'bg-blue-50' : ''} hover:bg-gray-50`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{contact.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 truncate max-w-xs">
                          {contact.message.length > 50 
                            ? `${contact.message.substring(0, 50)}...` 
                            : contact.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(contact.submitted_at)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={contact.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
                            setShowDetailsModal(true);
                            if (contact.status === 'unread') {
                              updateContactStatus(contact.id, 'read');
                            }
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          See
                        </button>
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {!loading && !error && contacts.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Display <span className="font-medium">{(pagination.currentPage - 1) * pagination.perPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.currentPage * pagination.perPage, pagination.totalItems)}
                    </span>{' '}
                    among <span className="font-medium">{pagination.totalItems}</span> cotact
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                      disabled={pagination.currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        pagination.currentPage === 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Pre</span>
                      &larr;
                    </button>
                    
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(page => 
                        page === 1 || 
                        page === pagination.totalPages || 
                        Math.abs(page - pagination.currentPage) <= 1
                      )
                      .map((page, index, array) => {
                        if (index > 0 && page - array[index - 1] > 1) {
                          return (
                            <span
                              key={`ellipsis-${page}`}
                              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                            >
                              ...
                            </span>
                          );
                        }
                        
                        return (
                          <button
                            key={page}
                            onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === pagination.currentPage
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        pagination.currentPage === pagination.totalPages
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      &rarr;
                    </button>
                  </nav>
                </div>
              </div>
              
              <div className="flex items-center justify-between w-full sm:hidden">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={pagination.currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    pagination.currentPage === 1
                      ? 'bg-white text-gray-300 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Trước
                </button>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">{pagination.currentPage}</span> / {pagination.totalPages}
                </div>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    pagination.currentPage === pagination.totalPages
                      ? 'bg-white text-gray-300 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showDetailsModal && selectedContact && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full overflow-hidden shadow-xl transform transition-all">
            <div className="px-6 pt-6 pb-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">Chi tiết liên hệ</h3>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  &times;
                </button>
              </div>
              
              <div className="mt-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Status:</label>
                  <div className="mt-1 flex items-center space-x-2">
                    <StatusBadge status={selectedContact.status} />
                    
                    <div className="ml-4">
                      <button
                        onClick={() => updateContactStatus(selectedContact.id, 'read')}
                        disabled={selectedContact.status === 'read'}
                        className={`px-3 py-1 text-xs font-medium rounded border ${
                          selectedContact.status === 'read'
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                        }`}
                      >
                        Mark as read
                      </button>
                      
                      <button
                        onClick={() => updateContactStatus(selectedContact.id, 'replied')}
                        disabled={selectedContact.status === 'replied'}
                        className={`ml-2 px-3 py-1 text-xs font-medium rounded border ${
                          selectedContact.status === 'replied'
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                        }`}
                      >
                        Mark as responded
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Name:</label>
                  <div className="mt-1 text-base text-gray-900">{selectedContact.name}</div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Email:</label>
                  <div className="mt-1 text-base text-gray-900">
                    <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:underline">
                      {selectedContact.email}
                    </a>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Date:</label>
                  <div className="mt-1 text-base text-gray-900">{formatDate(selectedContact.submitted_at)}</div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Content:</label>
                  <div className="mt-1 p-4 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedContact(contact => {
                    if (contact) {
                      setSelectedContact(contact);
                      setShowDeleteModal(true);
                    }
                    return contact;
                  });
                }}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-500"
              >
                Delete
              </button>
              
              <div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3"
                >
                  Close
                </button>
                
                
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showDeleteModal && selectedContact && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full overflow-hidden shadow-xl transform transition-all">
            <div className="px-6 pt-6 pb-4">
              <div className="flex flex-col items-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Delete</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 text-center">
                  Are you sure you want to delete the contact from<span className="font-medium">{selectedContact.name}</span>?
                  This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3"
              >
                Cancel
              </button>
              <button
                onClick={deleteContact}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}