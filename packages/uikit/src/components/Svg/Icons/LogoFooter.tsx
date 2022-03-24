import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

interface LogoProps extends SvgProps {
  isDark: boolean;
}

const LogoFooter: React.FC<LogoProps> = ({ isDark, ...props }) => {
  const textColor = isDark ? "#FFFFFF" : "#000000";
  return (
    <svg width="135" height="135" viewBox="0 0 135 135" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M67.357 0.0390625C30.427 0.0390625 0.166992 30.2991 0.166992 67.2291V67.2791C0.166992 104.269 30.427 134.469 67.357 134.469C85.797 134.469 102.647 126.939 114.807 114.729C126.967 102.569 134.547 85.7691 134.547 67.2791V67.2291C134.557 30.2991 104.297 0.0390625 67.357 0.0390625ZM112.967 112.889C98.557 127.299 66.457 118.569 41.237 93.3491C16.067 68.1791 7.34699 36.0291 21.747 21.6191C36.147 7.20906 68.257 15.9391 93.477 41.1591C118.657 66.3391 127.377 98.4891 112.967 112.889Z"
        fill="url(#paint0_radial_2972_2592)"
      />
      <path
        d="M101.287 0.059082C111.307 0.059082 119.667 3.08908 125.607 9.02908C134.577 17.9991 136.917 32.4991 132.187 49.8691C127.487 67.1491 116.337 85.2191 100.817 100.739C85.2873 116.269 67.2173 127.409 49.9473 132.109C32.5673 136.839 18.0773 134.499 9.1073 125.529C0.137302 116.559 -2.2027 102.049 2.5273 84.6891C7.2273 67.4091 18.3773 49.3491 33.8973 33.8191C49.4173 18.2891 67.4873 7.14908 84.7673 2.43908C90.6373 0.849082 96.1773 0.059082 101.287 0.059082ZM33.4273 133.599C38.4573 133.599 43.9173 132.819 49.7173 131.239C66.8473 126.579 84.7673 115.519 100.187 100.099C115.607 84.6791 126.667 66.7591 131.337 49.6291C135.977 32.5891 133.717 18.3891 124.987 9.65908C116.237 0.929082 102.037 -1.33092 85.0073 3.30908C67.8773 7.96908 49.9473 19.0291 34.5373 34.4491C19.1073 49.8691 8.0573 67.7891 3.3873 84.9191C-1.2527 101.959 1.0073 116.159 9.7373 124.889C15.5073 130.659 23.6573 133.599 33.4273 133.599Z"
        fill="url(#paint1_radial_2972_2592)"
      />
      <path
        d="M34.2174 39.5393C37.1997 39.5393 39.6174 37.1216 39.6174 34.1393C39.6174 31.1569 37.1997 28.7393 34.2174 28.7393C31.235 28.7393 28.8174 31.1569 28.8174 34.1393C28.8174 37.1216 31.235 39.5393 34.2174 39.5393Z"
        fill="white"
      />
      <path
        d="M47.4873 67.039C47.4873 66.789 47.6373 66.549 47.9273 66.469L55.7373 64.329C60.1873 63.109 63.6673 59.629 64.8873 55.179L67.0273 47.369C67.1073 47.079 67.3473 46.939 67.5973 46.939V67.039H47.4873Z"
        fill="white"
      />
      <path
        d="M67.5874 46.939C67.8374 46.939 68.0774 47.079 68.1574 47.369L70.2974 55.189C71.5174 59.639 74.9974 63.109 79.4374 64.329L87.2474 66.469C87.5374 66.549 87.6874 66.799 87.6874 67.039H67.5874V46.939Z"
        fill="white"
      />
      <path
        d="M67.587 67.0391V87.1491C67.337 87.1491 67.097 86.9991 67.017 86.7091L64.877 78.8991C63.657 74.4491 60.1771 70.9691 55.7271 69.7491L47.917 67.6091C47.627 67.5291 47.4771 67.2891 47.4771 67.0391H67.587Z"
        fill="white"
      />
      <path
        d="M87.6972 67.0391C87.6972 67.2891 87.5472 67.5291 87.2572 67.6091L79.4472 69.7491C74.9972 70.9691 71.5272 74.4391 70.3072 78.8891L68.1672 86.7091C68.0872 86.9991 67.8372 87.1491 67.5972 87.1491V67.0391H87.6972Z"
        fill="white"
      />
      <defs>
        <radialGradient
          id="paint0_radial_2972_2592"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(65.128 -1.46634) scale(121.709)"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </radialGradient>
        <radialGradient
          id="paint1_radial_2972_2592"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(94.5547 106.377) scale(123.183)"
        >
          <stop offset="0.4064" stopColor="white" stopOpacity="0" />
          <stop offset="0.716" stopColor="white" />
          <stop offset="1" stopColor="white" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default React.memo(LogoFooter, (prev, next) => prev.isDark === next.isDark);
