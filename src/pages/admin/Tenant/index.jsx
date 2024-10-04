import React, { useState, useEffect } from "react";
import {
  PageContent,
  PageHeader,
  ContentBox,
} from "@/components/layout/PageContent";
import { Link, useNavigate } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import {  message, Space } from "antd";
import { BaseTable } from "@/components/common/Table";
import useToggle from "@/hooks/useToggle";
import { TenantService } from "@/apis/TenantService";

// const { Search } = Input;

const path = "/tenant";

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
    title: "Tenant",
  },
];

// eslint-disable-next-line no-unused-vars
export const deleteRecord = async (id) => {
  try {
    // await CustomerAPI.deleteCustomer(id);
    message.success("Xóa Tenant thành công!");
  } catch (error) {
    if (error.response?.status === 404) {
      message.error("Tenant không còn tồn tại!");
    } else {
      // TODO: handle DATA_USED
      message.error("Không thể xóa Tenant!");
    }
  }
}

const Tenant = () => {
  const navigate = useNavigate();

  // -------------------- Filter attr --------------------
  // const [openFilter, setOpenFilter] = useState(false); // control filter model open state

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
      title: "Mã tenant",
      key: "id",
      render: (_, record) => {
        return <Link to={`${path}/${record.id}`}>{record.id}</Link>;
      },
    },
    {
      title: "Tên miền",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Chủ cửa hàng",
      key: "fullName",
      render: (_, record) => {
        return (<>{record?.user?.fullName}</>)
      }
    },
    {
      title: "Email",
      key: "email",
      render: (_, record) => {
        return (<>{record?.user?.email}</>)
      }
    },
    {
      title: "Hoạt động",
      key: "initStatus",
      render: (_, record) => {
        return (<>{record?.initStatus ? "Đã kích hoạt" : "Chưa kích hoạt"}</>)
      }
    },
  ];

  // -------------------- Fetch table data --------------------
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        console.info("Query:", query);
        const dataResponse = await TenantService.getAll(query);
        console.info("Get All Tenant", dataResponse);
        setDataSource(dataResponse);
        setTotalRecord(dataResponse.length);
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
    navigate(`${path}/${record.id}`);
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
        {/* <Search
          placeholder="Tìm kiếm theo mã Tenant"
          allowClear
          enterButton
          onSearch={handleSubmitSearch}
          style={{ width: "400px" }}
          size="large"
        /> */}

        <Space>
          {/* <Button
            type="primary"
            icon={<FilterOutlined />}
            onClick={() => setOpenFilter(true)}
          >
            Bộ lọc
          </Button>

          <Button
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
          label="Tenant"
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

    </PageContent>
  );
};

export default Tenant;
