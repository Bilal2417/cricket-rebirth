import { SvgIcon } from "@mui/material";

export default function OversThreeIcon( data ) {
  return (
    <SvgIcon>
      {/* Circle */}
      <circle
        cx="12"
        cy="12"
        r="10"
        // stroke="currentColor"
        strokeWidth="2"
        fill="white"
        />
      {/* Number 3 */}
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontSize="12"
        fill="#343c53"
        style={{
          textShadow : "none",
          fontWeight : 600
        }}
      >
        {data.value}
      </text>
    </SvgIcon>
  );
}
