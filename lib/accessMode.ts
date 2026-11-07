export const isSharedViewer = (params:any) => params?.sharedViewer === true || params?.accessType === 'shared' || params?.access?.accessType === 'shared';
export const isOwnerWithCode = (params:any) => !!params?.accessCode && !isSharedViewer(params);
