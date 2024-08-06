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
    size: 10,
  });

  // fake
  const testStaff = {
    id: 1,
    fullName: "Nguyen Van A",
    dob: null,
    gender: null,
    email: "test@test.com",
    phone: null,
    address: null,
    province: null,
    district: null,
    active: true,
    note: null,
    roles: [
        {
            id: 1,
            name: "TENANT_ADMIN",
            description: null,
            permissions: [],
            createTime: "2024-08-04 18:10:52",
            updateTime: "2024-08-04 18:10:52"
        }
    ],
    createTime: "2024-08-04 18:10:52",
    updateTime: "2024-08-04 18:10:52"
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
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Sdt",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Tỉnh/TP",
      dataIndex: "province",
      key: "province",
    },
    {
      title: "Quận/Huyện",
      dataIndex: "district",
      key: "district",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
  ];

  // -------------------- Fetch table data --------------------
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        console.info("Query:", query);

        const dataResponse = await StaffSerivce.getAll(query);
        console.info("Get All Staff", dataResponse)
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
