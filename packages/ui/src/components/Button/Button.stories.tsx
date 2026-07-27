import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../Stack/Stack';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Save changes' },
  argTypes: {
    tone: { control: 'inline-radio', options: ['accent', 'neutral', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <Stack direction="row" gap="sm" align="center">
      <Button {...args} tone="accent" />
      <Button {...args} tone="neutral" />
      <Button {...args} tone="ghost" />
    </Stack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" gap="sm" align="center">
      <Button {...args} size="sm" />
      <Button {...args} size="md" />
      <Button {...args} size="lg" />
    </Stack>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
};
