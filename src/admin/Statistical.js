import React, { useState, useEffect, PureComponent } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import moment from "moment";
import { getStatisticalProduct } from "./apiAdmin";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button, Form } from "react-bootstrap";

const ManageBranches = () => {
  const [data, setData] = useState([]);
  const { user, token } = isAuthenticated();
  const [month, setMonth] = useState("Jul");
  const loadData = async () => {
    const data = await getStatisticalProduct(user._id,token,month);
    if (data.error) return console.log(data.error);
    setData(data.data);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    loadData();
  };
  const getTotal = (value) => {
    console.log(data);
    return data.reduce((currentValue, nextValue) => {
      return currentValue + nextValue[value];
    }, 0);
  };
  useEffect(() => {
    loadData();
  }, []);

  return (
    <Layout className="container-fluid">
      <div className="card" style={{ paddingBottom: "20px" }}>
        <h2 className="mt-2 text-center text-warning">
          Biểu đồ thống kê theo sản phẩm
        </h2>
        <Form
          style={{ width: "25%", marginLeft: "75%" }}
          onSubmit={(e) => handleSubmit(e)}
        >
          <Form.Group className="mb-3">
            <Form.Label>Chọn tháng cần thống kê</Form.Label>
            <Form.Select
              required
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="">Chọn tháng</option>
              <option value="Jan">Tháng 1</option>
              <option value="Feb">Tháng 2</option>
              <option value="Mar">Tháng 3</option>
              <option value="Apr">Tháng 4</option>
              <option value="May">Tháng 5</option>
              <option value="Jun">Tháng 6</option>
              <option value="Jul">Tháng 7</option>
              <option value="Aug">Tháng 8</option>
              <option value="Sep">Tháng 9</option>
              <option value="Oct">Tháng 10</option>
              <option value="Nov">Tháng 11</option>
              <option value="Dec">Tháng 12</option>
            </Form.Select>
          </Form.Group>
          <Button style={{marginLeft:"70%"}} type="submit" variant="outline-warning">
            Submit
          </Button>
        </Form>
        <h2 className="mt-2 text-center" style= {{color: "#8884d8"}}>
          Biểu đồ thống kê doanh thu theo sản phẩm
        </h2>
        <h2>Tổng doanh thu: ${data !== [] ? getTotal("amount") : 0}</h2>
        <div
          style={{ display: "flex", justifyContent: "center", padding: "20px" }}
        >
            
            <BarChart
              width={1000}
              height={400}
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name"/>
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
            
        </div>
        <h2 className="mt-2 text-center" style= {{color: "#82ca9d"}}>
          Biểu đồ thống kê số lượng sản phẩm đã bán
        </h2>
        <h2>Tổng số sản phẩm đã bán: {data !== [] ? getTotal("sold") : 0}</h2>
        <div
          style={{ display: "flex", justifyContent: "center", padding: "50px" }}
        >
            <BarChart
              width={1000}
              height={400}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sold" fill="#82ca9d" />
            </BarChart>
            
        </div>
        
      </div>
    </Layout>
  );
};

export default ManageBranches;
