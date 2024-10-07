import React, { useState, useEffect } from "react";
import {
  PageContent,
  PageHeader,
  ContentBox,
} from "@/components/layout/PageContent";
import { Link, useNavigate } from "react-router-dom";
import { HomeOutlined, PlusOutlined, FilterOutlined } from "@ant-design/icons";
import { Input, Button, message, Space, Avatar } from "antd";
import { BaseTable } from "@/components/common/Table";
import useToggle from "@/hooks/useToggle";
import { ROUTE } from "@/constants/AppConstant";
import PromoteFilterModal from "./PromoteFilterModal";
import { PromoteService } from "@/apis/PromoteService";

const { Search } = Input;

const noImageurl = "https://retail-chain-sale-ms.s3.ap-southeast-2.amazonaws.com/no_image_450.png"

const path = ROUTE.TENANT_APP.PROMOTE.path;

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
    title: "Khuyến mãi",
  },
];

// eslint-disable-next-line no-unused-vars
export const deleteRecord = async (id) => {
  try {
    // await CustomerAPI.deleteCustomer(id);
    message.success("Xóa khuyến mãi thành công!");
  } catch (error) {
    if (error.response?.status === 404) {
      message.error("khuyến mãi không còn tồn tại!");
    } else {
      // TODO: handle DATA_USED
      message.error("Không thể xóa khuyến mãi!");
    }
  }
}

const Promote = () => {
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
      title: "Mã khuyến mãi",
      key: "id",
      render: (_, record) => {
        return <Link to={`${path}/${record.id}`}>{record.name}</Link>;
      },
    },
    {
      title: "Tên khuyến mãi",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Loại khuyến mãi",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "% hóa đơn",
      dataIndex: "percentage",
      key: "percentage",
    },
    {
      title: "Giá giảm tối đa",
      dataIndex: "maxDiscount",
      key: "maxDiscount",
    },
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, record) => {
        if (record?.product !== null)
        return (
          <>
            <Avatar shape="square" alt="" size={48} src={record.product?.imageUrl ? record?.product.imageUrl : noImageurl} />{" "}
            <Link to={`${ROUTE.TENANT_APP.PRODUCT.path}/${record?.product?.id}`} target="_blank">{record?.product?.name}</Link>
          </>
        );
      },
    },
    {
      title: "Giảm giá sản phẩm",
      dataIndex: "discountPrice",
      key: "discountPrice",
    },
    {
      title: "Giảm giá hóa đơn",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "SL SP tối thiểu",
      dataIndex: "minQuantityRequired",
      key: "minQuantityRequired",
    },
    {
      title: "Tổng số tiền tối thiểu",
      dataIndex: "minAmountRequired",
      key: "minAmountRequired",
    },
  ];

  // -------------------- Fetch table data --------------------
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        console.info("Query:", query);
        const dataResponse = await PromoteService.getAll(query);
        console.info("Get All ", dataResponse);
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
          placeholder="Tìm kiếm theo tên, mã khuyến mãi"
          allowClear
          enterButton
          onSearch={handleSubmitSearch}
          style={{ width: "400px" }}
          size="large"
        />

        <Space>
          <Button
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
          </Button>
        </Space>

      </PageHeader>

      <ContentBox>
        <BaseTable
          label="Khuyến mãi"
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
        />
      </ContentBox>

      <PromoteFilterModal
        open={openFilter}
        setOpen={setOpenFilter}
        query={query}
        setQuery={setQuery}
      />
    </PageContent>
  );
};

export default Promote;
