import { quadrantAngle } from "./quadrantAngle";

const equivalantAngles = [
  [80, 80],
  [90, 90],
  [100, 80],
  [190, 10],
  [280, 80],
  [360, 0],
  [370, 10],
];

equivalantAngles.forEach(([angle, equivalent]) => {
  it(`${angle} and ${equivalent} are equivalent`, () => {
    expect(quadrantAngle(angle)).toEqual(equivalent);
  });
});
