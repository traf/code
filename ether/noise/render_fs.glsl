uniform vec2 nearFar;

varying float size;
varying vec3 vColor;

void main() {
    float r = length(gl_PointCoord.xy - vec2(0.5));
    if (r > 0.5) discard;

    gl_FragColor = vec4(vColor, 1.0);
}