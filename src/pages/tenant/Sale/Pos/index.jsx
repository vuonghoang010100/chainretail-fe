import React, { useState, useEffect } from "react";
import { PageContent, PageHeader } from "@/components/layout/PageContent";
import {
  Row,
  Col,
  Input,
  Flex,
  Card,
  message,
  Avatar,
  Typography,
  Spin,
  Pagination,
  Select,
  Button,
  InputNumber, 
  Divider,
} from "antd";
import { HomeOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { BatchService } from "@/apis/BatchService";
import { StoreService } from "@/apis/StoreService";
import { normalizeString } from "@/utils";
import useAuth from "@/hooks/useAuth";
import { DebounceSelect } from "@/components/common/Input/Select/DebounceSelect";
import { CustomerService } from "@/apis/CustomerService";
import { PromoteService } from "@/apis/PromoteService";
import { SaleService } from "@/apis/SaleService";
import useToggle from "@/hooks/useToggle";

const { Search } = Input;

const { Text } = Typography;

const noImageurl =
  "https://retail-chain-sale-ms.s3.ap-southeast-2.amazonaws.com/no_image_450.png";

const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: "Bán hàng",
  },
];

const Pos = () => {
  const { auth } = useAuth();
  const [reload, setReload] = useToggle(true);


  // --- Info
  const [storeId, setStoreId] = useState(-1);
  const employeeId = auth.userId;
  const status = {
    sell: "Hoàn thành",
    order: "Chờ xác nhận",
  };
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [details, setDetails] = useState([]);
  const [promotes, setPromotes] = useState([])
  const [promoteLK, setPromoteLK] = useState({});

  // --------------------------------- Calculate ---------------------------------
  const [subtotal, setSubtotal] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [quan, setQuan] = useState(0)
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let _subtotal = 0;
    details.forEach(detail => _subtotal = _subtotal + detail.subtotal);
    setSubtotal(_subtotal);

    let _quantity = 0;
    details.forEach(detail => _quantity = _quantity + detail._quantity)
    setQuan(_quantity)

    let _discount = 0;
    
    let removePromotes = []
    promotes.forEach(ele => {
      const promoteId = ele.value;
      const promote = promoteLK[promoteId];
      console.log(promote);
      

      let subdis = 0;
      
      if (promote.type === "Giảm giá sản phẩm") {
        let products = details.filter(detail => detail.product.id === promote.product.id)
        console.log(products);
        if (products.length === 0) {
          message.error("Giỏ hàng không chứa sản phẩm áp dụng khuyến mãi!")
          removePromotes.push(promote.id);
        }
        products.forEach(p => {
          subdis += p._quantity * (p.product.price - promote.discountPrice)
        })
      } else {
        if (promote.minQuantityRequired && promote.minQuantityRequired > _quantity) {
          message.error(`Không đủ điều kiện áp dụng khuyến mãi: ${promote.name}`)
        }
        else if (promote.minAmountRequired && promote.minAmountRequired > _subtotal) {
          message.error(`Không đủ điều kiện áp dụng khuyến mãi: ${promote.name}`);
          // remove this
          removePromotes.push(promote.id)
        } else {
          if (promote.type === "Số tiền Hóa đơn") {
            subdis = promote.amount;
          } else {
            subdis = _subtotal * promote.percentage / 100;
            if (subdis > promote.maxDiscount) 
              subdis = promote.maxDiscount;
          }
        }
      }

      _discount += subdis;
    })
    


    setDiscount(_discount);

    let _preTax = _subtotal - _discount;
    let _tax = 0;
    _tax = _preTax * taxPercentage / 100;

    setTax(_tax);

    
    setTotal(_preTax + _tax)

    if (removePromotes.length > 0) {
      setPromotes(prev => prev.filter(ele => !removePromotes.includes(ele.value)))
    }

  }, [details, taxPercentage, promotes])
  


  // --------------------------------- Product side  ---------------------------------
  const [batches, setBatches] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({
    page: 1,
    size: 10,
    storeId: storeId,
  });

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        console.info("Query:", query);
        const dataResponse = await BatchService.getAll(query);
        console.info("Get All Product", dataResponse);
        setBatches(dataResponse.data);
        setTotalRecord(dataResponse.total);
      } catch (error) {
        console.log(error);

        message.error("Không thể tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();


    const fetchPromote = async () => {
      try {
        const dataResponse = await PromoteService.getAll({page: 1, size: 100, storeId: storeId})
        const save = {};
        dataResponse.data.forEach(ele => {
          save[ele.id] = ele;
        })
        setPromoteLK(save);

      } catch (error) {
        message.error("Không thể tải dữ liệu khuyến mãi!");
      }
    }

    fetchPromote();
  }, [query, storeId, reload]);

  // Store filter -----

  const [stores, setStores] = useState([]);

  const handleChangeStore = (id) => {
    setStoreId(id);
    setQuery((prev) => ({
      ...prev,
      storeId: id,
    }));
    setDetails([])
  };

  // Fetch categories on first render
  useEffect(() => {
    let isMounted = false; // control mount data only one times

    const fetchData = async () => {
      try {
        const dataResponse = await StoreService.getWorkStore();
        if (!isMounted) {
          setStores(
            dataResponse.map((store) => ({
              label: store.name,
              value: store.id,
            }))
          );
        }
      } catch (error) {
        message.error("Không thể tải dữ liệu cửa hàng!");
      }
    };

    fetchData();

    // clean function
    return () => {
      isMounted = true;
    };
  }, []);

  const filterOption = (input, option) =>
    normalizeString(option.label).includes(normalizeString(input));


  // --------------------------------- Form side ---------------------------------
  const [activeTabKey, setActiveTabKey] = useState("sell");

  const tabListNoTitle = [
    {
      key: "sell",
      label: "Bán trực tiếp",
    },
    {
      key: "order",
      label: "Đặt hàng",
    },
  ];

  const onTab2Change = (key) => {
    setActiveTabKey(key);
  };

  const [customer, setCustomer] = useState(undefined);

  const changeQuan = (id, value) => {
    if (value)
      setDetails(prev => {
        for (let i = 0; i < prev.length; i++) {
          if (prev[i].id === id) {
            prev[i]._quantity = value;
            prev[i].subtotal = value * prev[i].product.price;
          }
        }

        return [...prev]
      })
  }

  const removeDetail = (id) => {
    setDetails(prev => {
      const ret = prev.filter(ele => ele.id !== id)
      return ret;
    })
  }


  const handleSubmit = async () => {
    const tp = taxPercentage ? taxPercentage : 0;
    const data = {
      taxPercentage: tp,
      status: status[activeTabKey],
      employeeId: employeeId,
      storeId: storeId,
      customerId: customer?.value,
    }

    data.promoteIds = []
    if (promotes.length > 0) {
      data.promoteIds = promotes.map(ele => ele.value)
    }

    data.details = []
    if (details.length === 0) {
      message.error("Vui lòng chọn sản phẩm!")
      return;
    }
    data.details = details.map(ele => ({
      batchId: ele.id,
      quantity: ele._quantity
    }))

    // check
    if( activeTabKey !== "sell" && !tp) {
      message.error("Vui lòng chọn khách hàng đặt hàng!")
    }

    console.log(data);
    
    // submit
    try {
      await SaleService.createSale(data);
      message.info("Giao dịch thành công!");
    } catch (error) {
      message.error("Không thể tạo hóa đơn!")
    }

    // reset
    setDetails([]);
    setPromotes([])
    setReload();

  }

  const Orderform = () => {
    return (
      <>
        <Row>
          <Text strong>Khách hàng </Text>
          <DebounceSelect
            style={{
              width: "100%",
            }}
            allowClear
            showSearch
            fetchOptions={CustomerService.search}
            formatResponeData={(data) =>
              data.map((option) => ({
                label: `${option.fullName} - ${option.phone}`,
                key: option.id,
                value: option.id,
              }))
            }
            defaultValue={customer}
            onChange={(value) => setCustomer(value)}
            placeholder="Tìm theo tên, số điện thoại khách hàng"
          />
        </Row>
        <Divider />
        <Row>
          <Col span={7}>
            <Text strong> Sản phẩm</Text>
          </Col>
          <Col span={2}>
            <Text strong> Lô</Text>
          </Col>
          <Col span={4}>
            <Text strong> Giá tiền</Text>
          </Col>
          <Col span={6}>
            <Text strong> Số lượng</Text>
          </Col>
          <Col span={4}>
            <Text strong> Tạm tính</Text>
          </Col>
          <Col span={1}></Col>
        </Row>
        <Divider />    
        {details.map((detail) => (
          <Row key={detail.id} style={{marginBottom: 24}}>
            <Col span={7}> <Avatar shape="square" size={32} src={detail.product.imageUrl ? detail.product.imageUrl : noImageurl} />{detail.product.name.substring(0, 18)} </Col>
            <Col span={2}>
              <Text> {detail.id}</Text>
            </Col>
            <Col span={4}>
              <Text>{`${detail.product.price}`.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      )}</Text>
            </Col>
            <Col span={6}>
              {/* <Text>{detail._quantity}</Text> */}
              <InputNumber min={1} max={detail.quantity} defaultValue={detail._quantity} onChange={(value) => changeQuan(detail.id, value)} />
            </Col>
            <Col span={4}>
              <Text>{detail.subtotal} đ</Text>
            </Col>
            <Col span={1}><DeleteOutlined style={{color:"#ff4d4f"}} onClick={() => removeDetail(detail.id)} /></Col>
          </Row>
        ))}

        <Divider />
        <Row>
          <Text strong>Chọn khuyến mãi </Text>
          <DebounceSelect
            mode="multiple"
            style={{
              width: "100%",
            }}
            allowClear
            
            showSearch
            fetchOptions={(value) => PromoteService.search(value, storeId, "Còn hiệu lực")}
            formatResponeData={(data) =>
              data.map((option) => ({
                label: `${option.name} - ${option?.description ? option?.description : ""}`,
                key: option.id,
                value: option.id,
              }))
            }
            defaultValue={promotes}
            onChange={setPromotes}
            placeholder="Tìm theo tên, số điện thoại khách hàng"
          />
        </Row>

        <Divider />
        <Flex justify="space-between">
          <Text strong>Tạm tính</Text>
          <Text>{`${subtotal}`.replace(/\B(?=(\d{3})+(?!\d))/g,",")} đ</Text>
        </Flex>

        <Divider />
        <Flex justify="space-between">
          <Text strong>Khuyến mãi</Text>
          <Text>{`-${discount}`.replace(/\B(?=(\d{3})+(?!\d))/g,",")} đ</Text>
        </Flex>

        <Divider />
        <Flex justify="space-between">
          <Text strong>Thuế (%)</Text>
          <InputNumber min={0} max={100} defaultValue={taxPercentage}  onChange={(value) => setTaxPercentage(value)}/>
          <Text>{`${tax}`.replace(/\B(?=(\d{3})+(?!\d))/g,",")} đ</Text>
        </Flex>

        <Divider />
        <Flex justify="space-between">
          <Text strong>Tổng số tiền</Text>
          <Text>{`${total}`.replace(/\B(?=(\d{3})+(?!\d))/g,",")} đ</Text>
        </Flex>

        <Divider />

        <Button type="primary" block onClick={handleSubmit}>
          {activeTabKey === "sell" ? "Thanh toán" : "Đặt hàng"}
        </Button>

      </>
    );
  };

  // --------------------------------- Product side  ---------------------------------
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

  const addBatch = (batch) => {
    setDetails((prev) => {
      let check = true;

      for (let i = 0; i < prev.length; i++) {
        if (prev[i].id === batch.id) {
          if (prev[i]._quantity < prev[i].quantity) {
            prev[i]._quantity = prev[i]._quantity + 1;
            prev[i].subtotal = prev[i].product.price * prev[i]._quantity
          }
          check = false;
          break;
        }
      }

      if (check) {
        batch._quantity = 1;
        batch.subtotal = batch.product.price;
        prev.push(batch);
      }

      return [...prev];
    });
  };

  return (
    <PageContent>
      <PageHeader breadcrumbItems={breadcrumbItems}>
        <Select
          style={{
            width: "40%",
          }}
          showSearch
          allowClear
          filterOption={filterOption}
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? "")
              .toLowerCase()
              .localeCompare((optionB?.label ?? "").toLowerCase())
          }
          options={stores}
          onChange={handleChangeStore}
          placeholder="Chọn cửa hàng"
        />
      </PageHeader>

      <Row>
        <Col span={12}>
          <Flex justify="center">
            <Search
              placeholder="Tìm kiếm theo tên sản phẩm, mã vạch"
              allowClear
              enterButton
              onSearch={handleSubmitSearch}
              style={{ width: "400px" }}
              size="large"
            />
          </Flex>

          {/* Product */}
          <br />
          {loading && (
            <Flex align="center" justify="center">
              <Spin size="large" />
            </Flex>
          )}
          <Flex gap="middle" wrap>
            {batches.map((batch) => (
              <Card
                key={batch.id}
                style={{
                  width: 160,
                }}
              >
                <Flex
                  vertical
                  justify="space-between"
                  style={{ height: "100%" }}
                >
                  <Flex vertical style={{ height: 238 }}>
                    <Avatar
                      shape="square"
                      size={112}
                      src={batch?.product?.imageUrl || noImageurl}
                    />
                    <Text strong>{batch.product.name.substring(0, 28)}</Text>
                    <Text type="secondary">Lô: {batch.id}</Text>
                    <Text>
                      Giá:{" "}
                      {`${batch.product?.price}`.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      )}{" "}
                      đ
                    </Text>
                    <Text>Số lượng: {batch.quantity}</Text>
                  </Flex>

                  <Button type="primary" onClick={() => addBatch(batch)}>
                    Thêm
                  </Button>
                </Flex>
              </Card>
            ))}
          </Flex>
          <br />
          {!loading && totalRecord > 0 && (
            <Flex justify="center">
              <Pagination
                showSizeChanger={true}
                showQuickJumper={true}
                current={query.page}
                pageSize={query.size}
                total={totalRecord}
                onChange={(page, pageSize) => {
                  setQuery((prev) => ({
                    ...prev,
                    page: page,
                    size: pageSize,
                  }));
                }}
              />
            </Flex>
          )}
        </Col>

        {/* Form */}
        <Col span={12}>
          <Card
            style={{
              width: "100%",
            }}
            tabList={tabListNoTitle}
            activeTabKey={activeTabKey}
            onTabChange={onTab2Change}
            tabProps={{
              size: "middle",
            }}
          >
            <Orderform/>
          </Card>
        </Col>
      </Row>
    </PageContent>
  );
};

export default Pos;
