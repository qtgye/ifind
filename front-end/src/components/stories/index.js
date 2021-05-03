import TiIcon from '../TiIcon';

export default {
    title: `Components/${TiIcon.componentName}`,
    component: TiIcon
}

const Template = TiIcon.bind({});

export const Sample = ({ icon }) = <TiIcon icon={args.icon} />;