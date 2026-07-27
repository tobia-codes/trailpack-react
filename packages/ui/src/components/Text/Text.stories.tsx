import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../Stack/Stack';
import { Text } from './Text';

const meta = {
  title: 'Components/Text',
  component: Text,
  args: { children: 'Packed for the trail.' },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Scale: Story = {
  render: (args) => (
    <Stack gap="sm">
      <Text {...args} size="xl" weight="bold" />
      <Text {...args} size="lg" />
      <Text {...args} size="md" />
      <Text {...args} size="sm" tone="muted" />
    </Stack>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <Stack gap="xs">
      <Text {...args} tone="default" />
      <Text {...args} tone="muted" />
      <Text {...args} tone="accent" />
    </Stack>
  ),
};

export const Mono: Story = {
  args: { mono: true, children: 'pnpm add @trailpack/react-ui' },
};
