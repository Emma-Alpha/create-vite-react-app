import { useState } from "react";
import { Table } from "antd";
import type { GetProp, TableProps } from "antd";
import { useQuery } from "react-query";
type ColumnsType<T> = TableProps<T>["columns"];
type TablePaginationConfig = Exclude<GetProp<TableProps, "pagination">, boolean>;
import { useBaseStore } from "@/store/base";
import styles from "./index.module.less";
import { t } from "i18next";

interface DataType {
  name: {
    first: string;
    last: string;
  };
  gender: string;
  email: string;
  login: {
    uuid: string;
  };
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

const columns: ColumnsType<DataType> = [
  {
    title: "Name",
    dataIndex: "name",
    sorter: true,
    render: (name) => `${name.first} ${name.last}`,
    width: "20%",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    filters: [
      { text: "Male", value: "male" },
      { text: "Female", value: "female" },
    ],
    width: "20%",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];

export const Pages: React.FC = () => {
  // const [data, setData] = useState<DataType[]>();
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 200,
    },
  });

  const { dataSource, getTableDataSource } = useBaseStore();

  const { isLoading, error } = useQuery({
    queryKey: [tableParams],
    queryFn: async () => {
      await getTableDataSource(tableParams);
    },
  });

  console.log(isLoading, error);

  const handleTableChange: TableProps["onChange"] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
    }
  };

  return (
    <>
      <span>{t("toast.accessSuccess")}</span>
      <span>{t("toast.accessFailed")}</span>
      <Table
        className={styles["baseTable"]}
        columns={columns}
        rowKey={(record) => record.login.uuid}
        dataSource={dataSource}
        pagination={tableParams.pagination}
        loading={isLoading}
        onChange={handleTableChange}
      />
    </>
  );
};
