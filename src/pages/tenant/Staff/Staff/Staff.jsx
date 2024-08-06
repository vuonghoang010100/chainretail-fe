import React, { useState, useEffect } from "react";
import {
  PageContent,
  PageHeader,
  ContentBox,
} from "@/components/layout/PageContent";
import { Link, useNavigate } from "react-router-dom";
import { HomeOutlined, PlusOutlined, FilterOutlined } from "@ant-design/icons";
import { Input, Space, Button, message } from "antd";
import { BaseTable } from "@/components/common/Table";
import useToggle from "@/hooks/useToggle";
import StaffFilterModal from "./StaffFilterModal";
import { StaffSerivce } from "@/apis/StaffService";

const { Search } = Input;

const path = "/staff";

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
    title: "Nhân viên",
  },
];

const Staff = () => {
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
    pageSize: 10,
  });

  // fake
  const testStaff = {
    id: "EMP000000001",
    full_name: "string",
    email: "user@example.com",
    phone_number: "123123",
    role: "Nhân viên",
    branch_name: "string",
    date_of_birth: "2024-03-27",
    gender: "Nam",
    province: "string",
    district: "string",
    address: "string",
    status: "Đang làm việc",
    note: "string",
  };

  // -------------------- Table columns --------------------
  const columns = [
    {
      title: "Mã nhân viên",
      key: "id",
      render: (_, record) => {
        return <Link to={`${path}/${record.id}`}>{record.id}</Link>;
      },
    },
    {
      title: "Họ và tên",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "Chức vụ",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Cửa hàng",
      dataIndex: "branch_name",
      key: "branch_name",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
  ];

  // -------------------- Fetch table data --------------------
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        // const dataResponse = await StaffAPI.getStaffs(query);
        // setDataSource(dataResponse.data);
        // setTotalRecord(dataResponse.meta.total);

        // const dataResponse = await StaffSerivce.getAll();
        // console.info("Get All Staff", dataResponse)

        // fake
        setDataSource([testStaff]);
        setTotalRecord(1);

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
  const handleCreateNew = (e) => {
    navigate(`${path}/new`);
  };

  const handleView = (record) => {
    navigate(`${path}/${record.id}`);
  };

  const handleEdit = (record) => {
    navigate(`${path}/${record.id}/edit`);
  };

  // delete customer
  const handleDelete = async (record) => {
    try {
      // await CustomerAPI.deleteCustomer(record.id);
      message.success("Xóa nhân viên thành công!");
      setReload();
    } catch (error) {
      if (error.response?.status === 404) {
        message.error("Nhân viên không còn tồn tại!");
      } else {
        // TODO: handle DATA_USED
        message.error("Không thể xóa nhân viên!");
      }
    }
  };

  // search
  const handleSubmitSearch = (value, _e, info) => {
    // Change search query
    setQuery((prev) => ({
      ...prev,
      page: 1,
      condition: value,
      //TODO: add filter param
      province: null,
      district: null,
      status: null,
    }));

    console.info("query search:", { value });
  };

  return (
    <PageContent>
      <PageHeader breadcrumbItems={breadcrumbItems} />

      <ContentBox>
        <Space>
          <Search
            placeholder="Tìm kiếm nhân viên"
            allowClear
            enterButton
            onSearch={handleSubmitSearch}
          />

          <Button
            type="primary"
            icon={<FilterOutlined />}
            onClick={() => setOpenFilter(true)}
          >
            Bộ lọc
          </Button>
        </Space>
      </ContentBox>

      <ContentBox>
        <BaseTable
          label="Nhân viên"
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
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateNew}
          >
            Thêm mới
          </Button>
        </BaseTable>  
      </ContentBox>
        
      <StaffFilterModal
        open={openFilter}
        setOpen={setOpenFilter}
        query={query}
        setQuery={setQuery}
      /> 
    </PageContent>

  )
};

export default Staff ;
