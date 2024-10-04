import React, { useState, useEffect } from "react";
import {
  PageContent,
  PageHeader,
  ContentBox,
} from "@/components/layout/PageContent";
import { Link, useNavigate } from "react-router-dom";
import { HomeOutlined, FilterOutlined } from "@ant-design/icons";
import { Input, Button, message, Space } from "antd";
import { BaseTable } from "@/components/common/Table";
import useToggle from "@/hooks/useToggle";
import { ROUTE } from "@/constants/AppConstant";
import InvoiceFilterModal from "./InvoiceFilterModal";
import { SaleService } from "@/apis/SaleService";

const { Search } = Input;

const path = ROUTE.TENANT_APP.INVOICE.path;

/**
 * Breadcrumd item for page
 */
const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: "Hóa đơn",
  },
];

// eslint-disable-next-line no-unused-vars
export const deleteRecord = async (id) => {
  try {
    // await CustomerAPI.deleteCustomer(id);
    message.success("Xóa hóa đơn thành công!");
  } catch (error) {
    if (error.response?.status === 404) {
      message.error("Hóa đơn không còn tồn tại!");
    } else {
      // TODO: handle DATA_USED
      message.error("Không thể xóa hóa đơn!");
    }
  }
}

const Invoice = () => {
  const navigate = useNavigate();

  // -------------------- Filter attr --------------------
  const [openFilter, setOpenFilter] = useState(false); // control filter model open state

  // -------------------- Table attr --------------------
  const [reload, setReload] = useToggle(); // reload table
  const [loading, setLoading] = useState(false); // control table loading state
  const [dataSource, setDataSource] = useState([]); // control table data
  const [totalRecord, setTotalRecord] = useState(0); // control number of page in table
  const [query, setQuery] = useState({
    page: 1,
    size: 10,
    // sort: "-createTime",
  });

  // -------------------- Table columns --------------------
  const columns = [
    {
      title: "Mã hóa đơn",
      key: "id",
      render: (_, record) => {
        return <Link to={`/order/${record.id}`}>{record?.invoice?.id}</Link>;
      },
    },
    {
      title: "Cửa hàng",
      key: "store",
      render: (_, record) => {
        return <Link to={`${ROUTE.TENANT_APP.STORE.path}/${record.store.id}`} target="_blank" >{record.store.name}</Link>
      }
    },
    {
      title: "Nhân viên",
      key: "employee",
      render: (_, record) => {
        return <Link to={`${ROUTE.TENANT_APP.STAFF.path}/${record.employee?.id}`} target="_blank" >{record.employee?.fullName}</Link>
      }
    },
    {
      title: "Khách hàng",
      key: "customer",
      render: (_, record) => {
        return <Link to={`${ROUTE.TENANT_APP.CUSTOMER.path}/${record?.customer?.id}`} target="_blank" >{record?.customer?.fullName}</Link>
      }
    },
    {
      title: "Tổng số tiền",
      key: "total",
      render: (_, record) => {
        return <>{`${record.total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " VND"}</>
      }
    },
    {
      title: "Trạng thái thanh toán",
      key: "status",
      render: (_, record) => {
        return (<>{record?.invoice?.paymentStatus}</>)
      }
    },
  ];

  // -------------------- Fetch table data --------------------
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        console.info("Query:", query);
        const dataResponse = await SaleService.getAllOrders(query);
        console.info("Get All Store", dataResponse);
        setDataSource(dataResponse.data);
        setTotalRecord(dataResponse.total);
      } catch (error) {
        console.log(error);

        message.error("Không thể tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query, reload]);

  // -------------------- Page function --------------------
  // eslint-disable-next-line no-unused-vars
  const handleCreateNew = (e) => {
    navigate(`${path}/new`);
  };

  const handleView = (record) => {
    // navigate(`${path}/${record.id}`);
    navigate(`/order/${record.id}`);
  };

  const handleEdit = (record) => {
    navigate(`${path}/${record.id}/edit`);
  };

  // delete
  const handleDelete = async (record) => {
    await deleteRecord(record.id);
    setReload();
  };

  // search
  // eslint-disable-next-line no-unused-vars
  const handleSubmitSearch = (value, _e, info) => {
    // Change search query
    setQuery((prev) => ({
      ...prev,
      page: 1,
      search: value,
    }));

    console.info("query search:", { value });
  };

  return (
    <PageContent>
      <PageHeader breadcrumbItems={breadcrumbItems}>
        <Search
          placeholder="Tìm kiếm theo mã hóa đơn"
          allowClear
          enterButton
          onSearch={handleSubmitSearch}
          style={{ width: "400px" }}
          size="large"
        />

        <Space>
          &nbsp;
          {/* <Button
            type="primary"
            icon={<FilterOutlined />}
            onClick={() => setOpenFilter(true)}
          >
            Bộ lọc
          </Button> */}

          {/* <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateNew}
          >
            Thêm mới
          </Button> */}
        </Space>

      </PageHeader>

      <ContentBox>
        <BaseTable
          label="Hóa đơn"
          columns={columns}
          rowKey="id"
          dataSource={dataSource}
          loading={loading}
          query={query}
          setQuery={setQuery}
          total={totalRecord}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          setReload={() => {
            setReload();
          }}
          edit_={false}
          delete_={false}
        />
      </ContentBox>

      <InvoiceFilterModal
        open={openFilter}
        setOpen={setOpenFilter}
        query={query}
        setQuery={setQuery}
      />
    </PageContent>
  );
};

export default Invoice;
