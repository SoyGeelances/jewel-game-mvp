
export type TextStyleConfig = {
  font: string;
  fill?: string;
  color: string;
  align: string;
  fontWeight?: string | number;
  stroke?: string;
  strokeThickness?: number;
  shadow?: {
      offsetX?: number;
      offsetY?: number;
      color?: string;
      blur?: number;
      fill?: boolean;
  };
  wordWrap?: {
      width?: number;
      useAdvancedWrap?: boolean;
  };
  lineSpacing?: number;
};

export type promptActions = { eventName: string; background: string; };

export type promptContentConfig = {
  title:  string;
  message:  string;
  actions: Array<promptActions>;
  data?: any
};
