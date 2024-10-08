import React from "react";
import { Outlet } from "react-router-dom";
import { Col, Row, Flex, Carousel, Space } from "antd";
import background1 from "@/assets/login-background-1.svg";
import background2 from "@/assets/login-background-2.svg";
import logo from "@/assets/logo.svg";

const LoginLayout = () => {
  // TODO: reposive + Logo + position
  const signup = true;

  if (signup)
    return (
      <Row
        style={{
          height: "100vh",
        }}
      >
        <Col
          span={12}
          style={{
            backgroundColor: "#1890FF",
          }}
        >
          <Row style={{
            padding: "24px"
          }
          }>
            <Space>
              <img src={logo} alt="" />
              <span
                style={{
                  color: "#dcf2ff", // TODO
                  // backgroundImage: "linear-gradient(45deg, #29CDFF, #FFFFFF)",
                  margin: "0",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                Chainretail.io.vn
              </span>
            </Space>
          </Row>
          <Row>
            <Col
              span={3}
              style={{
                backgroundColor: "#1890FF",
              }}
            />
            <Col
              span={18}
              style={{
                backgroundColor: "#1890FF",
              }}
            >
              <Carousel effect="fade" autoplay adaptiveHeight>
                <img src={background1} alt="" />
                <img src={background2} alt="" />
              </Carousel>
            </Col>
            <Col
              span={3}
              style={{
                backgroundColor: "#1890FF",
              }}
            />
          </Row>
        </Col>

        {/* <Col span={1}style={{
          backgroundColor: "#1890FF",
        }}/>
      <Col span={10}
        style={{
          backgroundColor: "#1890FF",
        }}
      >
        <Carousel effect="fade" autoplay adaptiveHeight>
          <img src={background1} alt=""/>
          <img src={background2} alt=""/>
        </Carousel> 
      </Col>
      <Col span={1}style={{
          backgroundColor: "#1890FF",
      }}/> */}

        <Col span={12}>
          <Outlet />
        </Col>
      </Row>
    );

  return (
    <Row
      style={{
        height: "100vh",
      }}
    >
      {/*       
      <Col span={12}
        style={{
          backgroundColor: "#1890FF",
        }}
      >
        <Carousel effect="fade" autoplay adaptiveHeight>
          <img src={background1} alt=""/>
          <img src={background2} alt=""/>
        </Carousel> 
      </Col> */}

      <Col
        span={24}
        style={{
          // backgroundColor: "#F5F5F5",
          backgroundColor: "#1890FF",
        }}
      >
        <Flex
          vertical
          align="center"
          justify="center"
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <Outlet />
        </Flex>
      </Col>
    </Row>
  );
  // return (
  //   <Row
  //     style={{
  //       height: "100vh"
  //     }}
  //   >
  //     <Col span={12}
  //       style={{
  //         backgroundColor: "#1890FF",
  //       }}
  //     >
  //       <Carousel effect="fade" autoplay adaptiveHeight>
  //         <img src={background1} alt=""/>
  //         <img src={background2} alt=""/>
  //       </Carousel>
  //     </Col>

  //     <Col span={12}
  //       style={{
  //         // backgroundColor: "#F5F5F5",
  //         backgroundColor: "#1890FF",
  //       }}
  //     >
  //       <Flex vertical align="center" justify="center"
  //         style={{
  //           height: "100%",
  //         }}
  //       >
  //         <Outlet/>
  //       </Flex>
  //     </Col>
  //   </Row>
  // );
};

export default LoginLayout;
