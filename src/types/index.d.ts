type ActionResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

type ActionListResponse<T> =
  | {
      success: true;
      data: {
        rows: T[];
        rowCount: number;
      };
    }
  | {
      success: false;
      error: string;
    };
