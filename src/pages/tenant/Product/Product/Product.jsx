import React, { useState, useEffect } from "react";
import {
  PageContent,
  PageHeader,
  ContentBox,
} from "@/components/layout/PageContent";
import { Link, useNavigate } from "react-router-dom";
import { HomeOutlined, PlusOutlined, FilterOutlined } from "@ant-design/icons";
import { Input, Button, message, Flex, Avatar } from "antd";
import { BaseTable } from "@/components/common/Table";
import useToggle from "@/hooks/useToggle";
import { ROUTE } from "@/constants/AppConstant";
import { ProductService } from "@/apis/ProductService";
import ProductFilterModal from "./ProductFilterModal";

const { Search } = Input;

const path = ROUTE.TENANT_APP.PRODUCT.path;

const noImageurl = "https://retail-chain-sale-ms.s3.ap-southeast-2.amazonaws.com/no_image_450.png"

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
    title: "Sản phẩm",
  },
];

const Product = () => {
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
      title: "Mã sản phẩm",
      key: "id",
      render: (_, record) => {
        return <Link to={`${path}/${record.id}`}>{record.id}</Link>;
      },
      width: 120,
    },
    {
      title: "Mã vạch",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Sản phẩm",
      key: "name",
      render: (_, record) => {
        return (
          <>
            <Avatar shape="square" size={48} src={record.imageUrl ? record.imageUrl : noImageurl} />{" "}
            {record.name}
          </>
        );
      },
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Nhóm sản phẩm",
      key: "category",
      render: (_, record) => {
        return (
          <Link 
          to={`${ROUTE.TENANT_APP.CATEGORY.path}/${record.category?.id}`}
          target="_blank"
          >
            {record.category?.name}
          </Link>
        );
      },
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Giá bán",
      key: "price",
      render: (_, record) => {
        return <>{`${record.price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " VND"}</>
      }
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
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
        const dataResponse = await ProductService.getAll(query);
        console.info("Get All Product", dataResponse);
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

  // delete
  // eslint-disable-next-line no-unused-vars
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
            placeholder="Tìm kiếm theo tên, mã vạch, thương hiệu"
            allowClear
            enterButton
            onSearch={handleSubmitSearch}
            style={{
              width: "400px",
            }}
          />

          <Button
            type="primary"
            icon={<FilterOutlined />}
            onClick={() => setOpenFilter(true)}
          >
            Bộ lọc
          </Button>
        </Flex>
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

      <ProductFilterModal
        open={openFilter}
        setOpen={setOpenFilter}
        setQuery={setQuery}
      />

    </PageContent>
  );
};

export default Product;
