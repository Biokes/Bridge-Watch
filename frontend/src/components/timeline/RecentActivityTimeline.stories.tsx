/**
 * Storybook stories for RecentActivityTimeline component
 */

import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import RecentActivityTimeline from "./RecentActivityTimeline";
import { useTimelineEvents } from "../../hooks/useTimelineEvents";
import type { TimelineEvent } from "../../types/timeline";

// Mock the hook for Storybook
const mockEvents: TimelineEvent[] = [
  {
    id: "1",
    type: "bridge",
    timestamp: new Date().toISOString(),
    title: "Bridge Circle status update",
    description: "Status: healthy, TVL: $1,000,000",
    bridgeName: "Circle",
    bridgeStatus: "healthy",
    totalValueLocked: 1000000,
    mismatchPercentage: 0,
    severity: "info",
    status: "active",
  },
  {
    id: "2",
    type: "alert",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    title: "High price deviation detected",
    description: "USDC price deviation exceeds threshold",
    severity: "critical",
    assetSymbol: "USDC",
    status: "active",
  },
  {
    id: "3",
    type: "health",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    title: "Health score update for USDC",
    description: "Score: 85.50, Trend: improving",
    assetSymbol: "USDC",
    previousScore: 80,
    currentScore: 85.5,
    trend: "improving",
    severity: "info",
  },
  {
    id: "4",
    type: "transaction",
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    title: "Completed transaction on Circle",
    description: "1000 USDC from Ethereum to Stellar",
    status: "completed",
    txHash: "0x1234567890abcdef",
    bridge: "Circle",
    asset: "USDC",
    amount: 1000,
    sourceChain: "Ethereum",
    destinationChain: "Stellar",
    severity: "info",
  },
  {
    id: "5",
    type: "asset",
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    title: "Asset PYUSD price update",
    description: "Price increased by 2.5%",
    assetSymbol: "PYUSD",
    assetName: "PayPal USD",
    healthScore: 92,
    priceChange: 2.5,
    severity: "info",
  },
  {
    id: "6",
    type: "bridge",
    timestamp: new Date(Date.now() - 18000000).toISOString(),
    title: "Bridge Wormhole status update",
    description: "Status: degraded, TVL: $500,000",
    bridgeName: "Wormhole",
    bridgeStatus: "degraded",
    totalValueLocked: 500000,
    mismatchPercentage: 5.2,
    severity: "warning",
    status: "pending",
  },
  {
    id: "7",
    type: "alert",
    timestamp: new Date(Date.now() - 21600000).toISOString(),
    title: "Bridge downtime detected",
    description: "Allbridge has been offline for 15 minutes",
    severity: "critical",
    bridgeName: "Allbridge",
    status: "active",
  },
];

const meta: Meta<typeof RecentActivityTimeline> = {
  title: "Components/Timeline/RecentActivityTimeline",
  component: RecentActivityTimeline,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="bg-stellar-dark p-6 min-h-screen">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RecentActivityTimeline>;

export const Default: Story = {
  args: {
    maxEvents: 50,
    defaultMode: "compact",
    showFilters: true,
    showHeader: true,
  },
};

export const CompactMode: Story = {
  args: {
    defaultMode: "compact",
    showFilters: true,
    showHeader: true,
  },
};

export const ExpandedMode: Story = {
  args: {
    defaultMode: "expanded",
    showFilters: true,
    showHeader: true,
  },
};

export const WithoutFilters: Story = {
  args: {
    showFilters: false,
    showHeader: true,
  },
};

export const WithoutHeader: Story = {
  args: {
    showFilters: true,
    showHeader: false,
  },
};

export const LimitedEvents: Story = {
  args: {
    maxEvents: 3,
    showFilters: true,
    showHeader: true,
  },
};

export const WithDefaultFilters: Story = {
  args: {
    defaultFilters: {
      types: ["alert", "bridge"],
      severities: ["critical", "warning"],
    },
    showFilters: true,
    showHeader: true,
  },
};

export const AssetFocused: Story = {
  args: {
    defaultFilters: {
      assetSymbol: "USDC",
    },
    showFilters: true,
    showHeader: true,
  },
};

export const BridgeFocused: Story = {
  args: {
    defaultFilters: {
      bridgeName: "Circle",
    },
    showFilters: true,
    showHeader: true,
  },
};

export const CriticalOnly: Story = {
  args: {
    defaultFilters: {
      severities: ["critical"],
    },
    showFilters: true,
    showHeader: true,
  },
};
