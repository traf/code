uniform sampler2D positions;
uniform vec2 nearFar;
uniform float pointSize;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;

varying float size;
varying vec3 vColor;

void main() {
    vec3 pos = texture2D(positions, position.xy).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    size = max(1.0, (step(1.0 - (1.0 / 512.0), position.x)) * pointSize);
    gl_PointSize = size;

    // Generate a unique random value for this vertex
    float random = fract(sin(dot(position.xy, vec2(12.9898, 78.233))) * 43758.5453);

    // Choose color based on random value
    vec3 baseColor;
    if (random < 0.33) {
        baseColor = color1;
    } else if (random < 0.66) {
        baseColor = color2;
    } else {
        baseColor = color3;
    }

    // Add slight variation to each particle
    vColor = baseColor;
    vColor.r += (random * 0.1 - 0.05);
    vColor.g += (random * 0.1 - 0.05);
    vColor.b += (random * 0.1 - 0.05);
}