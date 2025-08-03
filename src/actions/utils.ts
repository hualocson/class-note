const makeActionError = (error: string): ActionResponse<never> => {
  return {
    success: false,
    error,
  };
};

const makeActionSuccess = <T>(data: T): ActionResponse<T> => {
  return {
    success: true,
    data,
  };
};

const makeActionListSuccess = <T>(data: {
  rows: T[];
  rowCount: number;
}): ActionListResponse<T> => {
  return {
    success: true,
    data,
  };
};

export { makeActionError, makeActionSuccess, makeActionListSuccess };
