import { StatusChangeContent, TimeChangeContent, WorkerChangeContent, AttachmentChangeContent } from './TaskChanged';

export const renderChangeContent = (change) => {
    switch (change.type) {
        case 'status':
            return <StatusChangeContent change={change} />;
        case 'time':
            return <TimeChangeContent change={change} />;
        case 'staff':
            return <WorkerChangeContent change={change} />;
        case 'attachment':
            return <AttachmentChangeContent change={change} />;
        default:
            return null;
    }
};