import React from "react";
import { Helmet } from "react-helmet-async";

const Title = ({ title = "Chat App", description = "Mern Stack Chat App" }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta nsme="description" content={description} />
    </Helmet>
  );
};

export default Title;
