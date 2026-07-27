import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from '../Text/Text';
import { Stack } from './Stack';

const meta = {
  title: 'Components/Stack',
  component: Stack,
  argTypes: {
    gap: { control: 'inline-radio', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
    direction: { control: 'inline-radio', options: ['row', 'column'] },
  },
  args: {
    children: (
      <>
        <Text>First</Text>
        <Text>Second</Text>
        <Text>Third</Text>
      </>
    ),
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Column: Story = {};

export const Row: Story = {
  args: { direction: 'row', gap: 'lg' },
};

export const Wrapping: Story = {
  args: { direction: 'row', gap: 'sm', wrap: true },
};
