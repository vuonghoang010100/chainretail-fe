import React, { useState, useEffect } from "react";
import {
  PageContent,
  PageHeader,
  ContentBox,
} from "@/components/layout/PageContent";
import { Link, useNavigate } from "react-router-dom";
import { HomeOutlined, PlusOutlined } from "@ant-design/icons";
import { Input, Button, message, Flex } from "antd";
import { BaseTable } from "@/components/common/Table";
import useToggle from "@/hooks/useToggle";
import { ROUTE } from "@/constants/AppConstant";
import { CategoryService } from "@/apis/CategoryService";

const { Search } = Input;

const path = ROUTE.TENANT_APP.CATEGORY.path;

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
    title: "Nhóm sản phẩm",
  },
];

const Category = () => {
  const navigate = useNavigate();

  // -------------------- Table attr --------------------
  const [reload, setReload] = useToggle(); // reload table
  const [loading, setLoading] = useState(false); // control table loading state
  const [dataSource, setDataSource] = useState([]); // control table data
  const [totalRecord, setTotalRecord] = useState(0); // control number of page in table
  const [query, setQuery] = useState({
    page: 1,
    size: 10,
    sort: "-createTime",
  });

  // -------------------- Table columns --------------------
  const columns = [
    {
      title: "Mã NSP",
      key: "id",
      render: (_, record) => {
        return <Link to={`${path}/${record.id}`}>{record.id}</Link>;
      },
    },
    {
      title: "Tên nhóm sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
  ];

  // -------------------- Fetch table data --------------------
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        console.info("Query:", query);
        const dataResponse = await CategoryService.getAll(query);
        console.info("Get All Category", dataResponse);
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
    navigate(`${path}/${record.id}`);
  };

  const handleEdit = (record) => {
    navigate(`${path}/${record.id}/edit`);
  };

  // delete customer
  // eslint-disable-next-line no-unused-vars
  const handleDelete = async (record) => {
    try {
      // await CustomerAPI.deleteCustomer(record.id);
      message.success("Xóa cửa hàng thành công!");
      setReload();
    } catch (error) {
      if (error.response?.status === 404) {
        message.error("Cửa hàng không còn tồn tại!");
      } else {
        // TODO: handle DATA_USED
        message.error("Không thể xóa cửa hàng!");
      }
    }
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
      <PageHeader breadcrumbItems={breadcrumbItems} />

      <ContentBox>
        <Flex justify="center" gap="middle">
          <Search
            placeholder="Tìm kiếm theo tên"
            allowClear
            enterButton
            onSearch={handleSubmitSearch}
            style={{
              width: "400px",
            }}
          />
        </Flex>
      </ContentBox>

      <ContentBox>
        <BaseTable
          label="Cửa hàng"
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
    </PageContent>
  );
};

export default Category;
