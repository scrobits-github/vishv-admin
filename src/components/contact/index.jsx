import React, { useState, useEffect } from "react";
import { IP } from "../../config/IPConfig";
import { Space, Table, Tag } from "antd";
const productColumn = [
  {
    title: "Full Name",
    dataIndex: "fullName",
    key: "fullName",
    // render: (text) => <a>{text}</a>,
  },
  {
    title: "Email",
    dataIndex: "emailId",
    key: "emailId",
  },
  {
    title: "Contact",
    dataIndex: "contactNumber",
    key: "contactNumber",
  },
  /* {
    title: "Query",
    dataIndex: "contact_ty",
    key: "contact_type",
  }, */
  {
    title: "Product",
    dataIndex: "product_name",
    key: "product_name",
  },
];
const columns = [
  {
    title: "Full Name",
    dataIndex: "fullName",
    key: "fullName",
    // render: (text) => <a>{text}</a>,
  },
  {
    title: "Email",
    dataIndex: "emailId",
    key: "emailId",
  },
  {
    title: "Contact",
    dataIndex: "contactNumber",
    key: "contactNumber",
  },
  {
    title: "Query",
    dataIndex: "query",
    key: "query",
  },
  /*  {
    title: "Contact",
    dataIndex: "contactNumber",
    key: "contactNumber",
  }, */
  /*  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  }, */
  /*  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  }, */
];
/* const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
]; */
function ContactPage() {
  const [productContactList, setProductContactList] = useState([]);
  const [contactList, setContactList] = useState([]);
  useEffect(() => {
    fetch(`${IP}contact/get-all-contacts`)
      .then(async (res) => {
        const data = await res.json();
        data?.allContact?.map((item, index) => {
          if (item.contact_type === "normal") {
            console.log("contact ", contactList);
            setContactList((contactList) => [...contactList, item]);
          } else if (item?.contact_type === "product") {
            // setProductContactList(data?.allContact);
            setProductContactList((productContactList) => [
              ...productContactList,
              item,
            ]);
            console.log("product contact ", productContactList);
          }
        });
      })
      .catch((err) => {
        console.log("Error while calling contact users", err);
      });
  }, []);

  return (
    <div style={{ width: "80%", margin: "auto", marginTop: "5%" }}>
      <Table
        bordered
        pagination
        showHeader
        columns={columns}
        dataSource={contactList}
      />
      <h2>Prouduct Enquiries</h2>

      <Table
      style={{margin:'5% 0% 0% 0%'}}
        bordered
        pagination
        showHeader
        columns={productColumn}
        dataSource={productContactList}
      />
    </div>
  );
}

export default ContactPage;
