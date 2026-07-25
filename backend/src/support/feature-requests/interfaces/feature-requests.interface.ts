export type FeatureRequestStatus = 'Submitted' | 'Under Review' | 'Planned' | 'In Development' | 'Shipped';

export interface FeatureRequest {
  id: string;
  subject: string; // Subject
  machine: string; // Machine
  status: FeatureRequestStatus; // Status
  raisedBy: string; // Raised By
  raisedOn: string; // Raised On
  updatedOn: string; // Updated On
  resolvedAt: string; // Resolved At
  assignedTo: string; // Assigned To
}
