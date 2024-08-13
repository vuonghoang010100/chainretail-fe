import React from "react";
import { Outlet } from "react-router-dom";
import { Col, Row, Flex } from "antd";
// import background1 from "@/assets/login-background-1.svg"
// import background2 from "@/assets/login-background-2.svg"

const LoginLayout = () => {
  // TODO: reposive + Logo + position
  return (
    <Row
      style={{
        height: "100vh"
      }}
    >
      {/* <Col span={12}
        style={{
          backgroundColor: "#1890FF",
        }}
      >
        <Carousel effect="fade" autoplay adaptiveHeight>
          <img src={background1} alt=""/>
          <img src={background2} alt=""/>
        </Carousel> 
      </Col> */}

      <Col span={24}
        style={{
          // backgroundColor: "#F5F5F5",
          backgroundColor: "#1890FF",
        }}
      >
        <Flex vertical align="center" justify="center"
          style={{
            height: "100%",
            width: "100%"
          }}
        >
          <Outlet/>
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
}

export default LoginLayout;