import React from "react";
import Button from "./index";

export default {
    title: 'Navbar Mobile',
    component: Button,
}

const Template = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
};
