import { component } from "@sb";
import FlagSelectComponent from "..";

export default component({
  title: "Flag Select",
  component: FlagSelectComponent,
});

// Define Templates in order to accept args
const Template = (args) => <FlagSelectComponent {...args} />;

// Default
export const NonSelected = Template.bind({});
NonSelected.args = {
  customLabels: {
    us: "English",
    de: "German",
  },
  placeholder: "Please Select",
};

// With Selected on load
export const WithSelected = Template.bind({});
WithSelected.args = {
  customLabels: {
    us: "English",
    de: "German",
  },
  placeholder: "Please Select",
  selected: "de",
};
