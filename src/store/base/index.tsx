import { create } from "zustand";
import qs from "qs";
import type { GetProp, TableProps } from "antd";

type TablePaginationConfig = Exclude<GetProp<TableProps, "pagination">, boolean>;

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

const getRandomuserParams = (params: TableParams) => ({
  results: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});

interface BaseBearState {
  dataSource: any[];
  setDataSource: (v: any[]) => void;
  getTableDataSource: (tableParams: TableParams) => Promise<any>;
}

export const useBaseStore = create<BaseBearState>()((set) => ({
  dataSource: [],
  setDataSource: (v: any[]) => {
    set({ dataSource: v });
  },
  getTableDataSource: async (tableParams) => {
    const { results } = await fetch(
      `https://randomuser.me/api?${qs.stringify(getRandomuserParams(tableParams))}`,
    ).then((res) => res.json());
    set({ dataSource: results });
  },
}));
