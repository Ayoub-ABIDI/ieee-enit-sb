import { STARS } from "../constants/data";

function Stars() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        {STARS.map(s => (
          <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white">
            <animate attributeName="opacity" values=".06;.7;.06"
              dur={`${s.dur}s`} begin={`${s.del}s`} repeatCount="indefinite"/>
          </circle>
        ))}
      </svg>
    </div>
  );
}

export default Stars;
