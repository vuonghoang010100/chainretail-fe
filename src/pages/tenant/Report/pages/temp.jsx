import React from "react";
import { ContentBox, PageContent, PageHeader } from "@/components/layout/PageContent";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";


const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: "Báo cáo",
  },
];

const Report = () => {

  return (
    <PageContent>
      <PageHeader breadcrumbItems={breadcrumbItems}>
        
      </PageHeader>

      <ContentBox></ContentBox>

    </PageContent>
    );
};

export default Report;
