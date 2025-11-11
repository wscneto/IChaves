
export interface CreateNotificationRequest {
    Message: string;

    //CreatedAt: string;
    ReadAt?: string;
    IDUserFK: number;
}

export interface UpdateNotificationRequest {
    Message?: string;
    //CreatedAt?: string;
    ReadAt?: string;
    IDUserFK?: number;
}

export interface NotificationResponse {
    success: boolean;
    data: {
        IDNotification: number;
        Message: string;
        CreatedAt: string;
        ReadAt?: string;
        IDUserFK: number;
        User?: {
            IDUser: number;
            Name: string;
            Email: string;
        };
    };
    message: string;
}

export interface NotificationFilters {
    IDUserFK?: number;
    ReadAt?: boolean;
    CreatedAt: {
        from?: string;
        to?: string;
    };
}

export interface CreateNotificationData {
    Message: string;
   
    //CreatedAt: string;
    ReadAt?: string;
    IDUserFK: number;
}

export interface UpdateNotificationData {
    Message?: string;
    CreatedAt?: string;
    ReadAt?: string;
    IDUserFK?: number;
}