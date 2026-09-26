// The CRAFT headline for the Impact section: SVG markup plus the script that plays it.
//
// Choreography: the R draws first; the C closes into a solid disc that shoots a Polaroid
// out on a slant (spinning twice) and pockets it again; then A, F and the T — first as a +
// level with the F's middle arm — snap in. The wave rolls up from the bottom edge and back,
// three stars pop out of the F and burst above the T, a cellphone becomes the T's upright,
// and the sunglasses drop onto the A last.
//
// Rule: assets never change size and never fade. They are only ever hidden by a letter
// (the masks), by the edge of the headline area (overflow: hidden), or gone in a burst.
// Every id is prefixed "ic-" so the defs cannot collide with anything else on the page.

export const CRAFT_SVG = "<defs>\n<filter id=\"ic-stk-cut\" x=\"-25%\" y=\"-25%\" width=\"150%\" height=\"150%\" color-interpolation-filters=\"sRGB\">\n<feMorphology in=\"SourceAlpha\" operator=\"dilate\" radius=\"4.5\" result=\"grow\" />\n<feFlood flood-color=\"#ffffff\" /><feComposite in2=\"grow\" operator=\"in\" result=\"cut\" />\n<feOffset in=\"grow\" dx=\"0\" dy=\"3\" result=\"drop\" /><feGaussianBlur in=\"drop\" stdDeviation=\"2.4\" result=\"dropb\" />\n<feFlood flood-color=\"#151412\" flood-opacity=\".22\" /><feComposite in2=\"dropb\" operator=\"in\" result=\"shadow\" />\n<feMerge><feMergeNode in=\"shadow\" /><feMergeNode in=\"cut\" /><feMergeNode in=\"SourceGraphic\" /></feMerge>\n</filter>\n<pattern id=\"ic-dots\" width=\"6\" height=\"6\" patternUnits=\"userSpaceOnUse\"><circle cx=\"3\" cy=\"3\" r=\"1.25\" fill=\"#151412\" opacity=\".2\" /></pattern>\n<linearGradient id=\"ic-lens-fade\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#111111\" stop-opacity=\".96\" /><stop offset=\".55\" stop-color=\"#111111\" stop-opacity=\".72\" /><stop offset=\"1\" stop-color=\"#111111\" stop-opacity=\".22\" /></linearGradient>\n<linearGradient id=\"ic-sunset\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#ef4a2f\" /><stop offset=\".55\" stop-color=\"#f58a2a\" /><stop offset=\"1\" stop-color=\"#f5c518\" /></linearGradient>\n<clipPath id=\"ic-capline\"><rect x=\"-200\" y=\"-70\" width=\"800\" height=\"70\" /></clipPath>\n<mask id=\"ic-c-pocket\" maskUnits=\"userSpaceOnUse\" x=\"-600\" y=\"-600\" width=\"1600\" height=\"1400\">\n<rect x=\"-600\" y=\"-600\" width=\"1600\" height=\"1400\" fill=\"#fff\" /><circle id=\"ic-c-pocket-disc\" cx=\"35\" cy=\"-35\" r=\"35\" fill=\"#000\" />\n</mask>\n<mask id=\"ic-f-pocket\" maskUnits=\"userSpaceOnUse\" x=\"-600\" y=\"-600\" width=\"1600\" height=\"1400\">\n<rect x=\"-600\" y=\"-600\" width=\"1600\" height=\"1400\" fill=\"#fff\" /><rect x=\"222\" y=\"-70\" width=\"52\" height=\"400\" fill=\"#000\" />\n</mask>\n</defs>\n<g class=\"ink\" clip-path=\"url(#ic-capline)\">\n<g class=\"lt\" data-ch=\"C\">\n<path class=\"draw\" id=\"ic-c-arc\" pathLength=\"1\" d=\"M57.2 -53.6 A29 29 0 1 0 57.2 -16.4\" style=\"--d: 380ms; --dur: 320ms\" />\n</g>\n<g class=\"lt\" data-ch=\"R\">\n<path class=\"rise\" d=\"M86 -64 L86 -6\" style=\"transform-origin: 86px 0px; --d: 0ms; --dur: 220ms\" />\n<path class=\"draw\" pathLength=\"1\" d=\"M86 -64 L108 -64 A17 17 0 0 1 108 -30 L86 -30\" style=\"--d: 120ms; --dur: 200ms\" />\n<path class=\"draw\" pathLength=\"1\" d=\"M106 -27 L131 5\" style=\"--d: 220ms; --dur: 180ms\" />\n</g>\n<g class=\"lt join\" style=\"--jx: 60px; --dj: 2300ms\" data-ch=\"A\">\n<path class=\"draw\" pathLength=\"1\" d=\"M150 4 L178 -67.5 L206 4\" style=\"--d: 2320ms; --dur: 280ms\" />\n</g>\n<g class=\"lt join\" style=\"--jx: 110px; --dj: 2360ms\" data-ch=\"F\">\n<path class=\"draw\" pathLength=\"1\" d=\"M230 -64 L230 -6\" style=\"--d: 2380ms; --dur: 200ms\" />\n<path class=\"draw\" pathLength=\"1\" d=\"M230 -64 L266 -64\" style=\"--d: 2480ms; --dur: 160ms\" />\n<path class=\"draw\" pathLength=\"1\" d=\"M230 -36 L258 -36\" style=\"--d: 2520ms; --dur: 160ms\" />\n</g>\n<g class=\"lt\" data-ch=\"T\">\n<path class=\"tt\" id=\"ic-t-stem\" pathLength=\"1\" d=\"M322 -64 L322 -6\" />\n<path class=\"tt\" id=\"ic-t-bar\" pathLength=\"1\" d=\"M348 -64 L296 -64\" />\n</g>\n</g>\n<circle class=\"c-ring\" id=\"ic-c-ring\" cx=\"35\" cy=\"-35\" r=\"29\" pathLength=\"360\" />\n<g class=\"shades\" id=\"ic-shades\" transform=\"translate(178 -70)\"><g class=\"lens-px\"><clipPath id=\"ic-lens-l\"><path d=\"M -23.03 1.41 L -5.17 1.41 L -6.58 10.81 C -7.28 14.10 -9.40 15.51 -12.22 15.51 L -17.86 15.51 C -21.15 15.51 -23.03 13.63 -23.26 10.81 Z\" /></clipPath><g clip-path=\"url(#ic-lens-l)\" fill=\"#111111\" shape-rendering=\"crispEdges\"><rect x=\"-24.26\" y=\"0.41\" width=\"20.09\" height=\"5.20\" /><rect x=\"-24.26\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-23.16\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-22.06\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-20.96\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-19.86\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-18.76\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-17.66\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-16.56\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-15.46\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-14.36\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-13.26\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-12.16\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-11.06\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-9.96\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-8.86\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-7.76\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-6.66\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-5.56\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-4.46\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-24.26\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-23.16\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-22.06\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-20.96\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-19.86\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-18.76\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-17.66\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-16.56\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-15.46\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-14.36\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-13.26\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-12.16\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-11.06\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-9.96\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-8.86\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-7.76\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-6.66\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-5.56\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-4.46\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-24.26\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-23.16\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-22.06\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-20.96\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-19.86\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-18.76\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-17.66\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-16.56\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-15.46\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-14.36\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-13.26\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-12.16\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-11.06\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-9.96\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-8.86\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-7.76\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-6.66\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-5.56\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-4.46\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-23.16\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"-20.96\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"-18.76\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"-16.56\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"-14.36\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"-12.16\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"-9.96\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"-7.76\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"-5.56\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"-24.26\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-23.16\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-22.06\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-20.96\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-19.86\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-18.76\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-17.66\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-16.56\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-15.46\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-14.36\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-13.26\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-12.16\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-11.06\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-9.96\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-8.86\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-7.76\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-6.66\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-5.56\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-4.46\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-23.16\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"-20.96\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"-18.76\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"-16.56\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"-14.36\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"-12.16\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"-9.96\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"-7.76\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"-5.56\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"-24.26\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"-22.06\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"-19.86\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"-17.66\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"-15.46\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"-13.26\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"-11.06\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"-8.86\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"-6.66\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"-4.46\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"-20.96\" y=\"13.26\" width=\"1.16\" height=\"1.16\" /><rect x=\"-16.56\" y=\"13.26\" width=\"1.16\" height=\"1.16\" /><rect x=\"-12.16\" y=\"13.26\" width=\"1.16\" height=\"1.16\" /><rect x=\"-7.76\" y=\"13.26\" width=\"1.16\" height=\"1.16\" /><rect x=\"-24.26\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"-22.06\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"-19.86\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"-17.66\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"-15.46\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"-13.26\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"-11.06\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"-8.86\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"-6.66\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"-4.46\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /></g><clipPath id=\"ic-lens-r\"><path d=\"M 23.03 1.41 L 5.17 1.41 L 6.58 10.81 C 7.28 14.10 9.40 15.51 12.22 15.51 L 17.86 15.51 C 21.15 15.51 23.03 13.63 23.26 10.81 Z\" /></clipPath><g clip-path=\"url(#ic-lens-r)\" fill=\"#111111\" shape-rendering=\"crispEdges\"><rect x=\"4.17\" y=\"0.41\" width=\"20.09\" height=\"5.20\" /><rect x=\"4.17\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"5.27\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"6.37\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"7.47\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"8.57\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"9.67\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"10.77\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"11.87\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"12.97\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"14.07\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"15.17\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"16.27\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"17.37\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"18.47\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"19.57\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"20.67\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"21.77\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"22.87\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"23.97\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"4.17\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"5.27\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"6.37\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"7.47\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"8.57\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"9.67\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"10.77\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"11.87\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"12.97\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"14.07\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"15.17\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"16.27\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"17.37\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"18.47\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"19.57\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"20.67\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"21.77\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"22.87\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"23.97\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"4.17\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"5.27\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"6.37\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"7.47\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"8.57\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"9.67\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"10.77\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"11.87\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"12.97\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"14.07\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"15.17\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"16.27\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"17.37\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"18.47\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"19.57\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"20.67\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"21.77\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"22.87\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"23.97\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"5.27\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"7.47\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"9.67\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"11.87\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"14.07\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"16.27\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"18.47\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"20.67\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"22.87\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"4.17\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"5.27\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"6.37\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"7.47\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"8.57\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"9.67\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"10.77\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"11.87\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"12.97\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"14.07\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"15.17\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"16.27\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"17.37\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"18.47\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"19.57\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"20.67\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"21.77\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"22.87\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"23.97\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"5.27\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"7.47\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"9.67\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"11.87\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"14.07\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"16.27\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"18.47\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"20.67\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"22.87\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"4.17\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"6.37\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"8.57\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"10.77\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"12.97\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"15.17\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"17.37\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"19.57\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"21.77\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"23.97\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"7.47\" y=\"13.26\" width=\"1.16\" height=\"1.16\" /><rect x=\"11.87\" y=\"13.26\" width=\"1.16\" height=\"1.16\" /><rect x=\"16.27\" y=\"13.26\" width=\"1.16\" height=\"1.16\" /><rect x=\"20.67\" y=\"13.26\" width=\"1.16\" height=\"1.16\" /><rect x=\"4.17\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"6.37\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"8.57\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"10.77\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"12.97\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"15.17\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"17.37\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"19.57\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"21.77\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"23.97\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /></g></g>\n<path d=\"M -28.20 -0.47 L -30.08 0.94 M 28.20 -0.47 L 30.08 0.94\" fill=\"none\" stroke=\"#111111\" stroke-width=\"2.4\" stroke-linecap=\"round\" />\n<path d=\"M -27.26 0.47 C -27.26 -1.41 -25.85 -2.35 -23.97 -2.35 L -3.76 -2.35 C -1.88 -2.35 -0.94 -0.94 -1.41 0.94 L -3.29 11.28 C -4.23 15.98 -7.52 18.33 -11.75 18.33 L -18.33 18.33 C -23.03 18.33 -25.85 15.51 -26.32 11.28 Z M -23.03 1.41 L -5.17 1.41 L -6.58 10.81 C -7.28 14.10 -9.40 15.51 -12.22 15.51 L -17.86 15.51 C -21.15 15.51 -23.03 13.63 -23.26 10.81 Z\" fill=\"#111111\" fill-rule=\"evenodd\" />\n<path d=\"M 27.26 0.47 C 27.26 -1.41 25.85 -2.35 23.97 -2.35 L 3.76 -2.35 C 1.88 -2.35 0.94 -0.94 1.41 0.94 L 3.29 11.28 C 4.23 15.98 7.52 18.33 11.75 18.33 L 18.33 18.33 C 23.03 18.33 25.85 15.51 26.32 11.28 Z M 23.03 1.41 L 5.17 1.41 L 6.58 10.81 C 7.28 14.10 9.40 15.51 12.22 15.51 L 17.86 15.51 C 21.15 15.51 23.03 13.63 23.26 10.81 Z\" fill=\"#111111\" fill-rule=\"evenodd\" />\n\n\n<path d=\"M -2.82 1.41 Q 0.00 -1.88 2.82 1.41\" fill=\"none\" stroke=\"#111111\" stroke-width=\"2.4\" stroke-linecap=\"round\" />\n</g>\n<g mask=\"url(#ic-c-pocket)\">\n<g class=\"asset\" id=\"ic-pola\" transform=\"translate(35 -35) rotate(-30) scale(0.43) translate(-43 -50)\">\n<g filter=\"url(#ic-stk-cut)\">\n<rect x=\"0\" y=\"0\" width=\"86\" height=\"100\" rx=\"2\" fill=\"#fffdf7\" />\n<clipPath id=\"ic-pol-photo\"><rect x=\"8\" y=\"8\" width=\"70\" height=\"64\" /></clipPath>\n<rect x=\"8\" y=\"8\" width=\"70\" height=\"64\" fill=\"#ebe4d8\" />\n<image href=\"/impact/phase-2.jpg\" x=\"-22\" y=\"-18.5\" width=\"130\" height=\"162.5\" preserveAspectRatio=\"xMidYMid slice\" clip-path=\"url(#ic-pol-photo)\" />\n<path d=\"M14 86 C22 80 28 90 36 84 S50 82 56 86\" fill=\"none\" stroke=\"#9b958a\" stroke-width=\"1.6\" stroke-linecap=\"round\" />\n</g>\n</g>\n</g>\n<circle class=\"c-glint\" id=\"ic-c-glint\" cx=\"35\" cy=\"-35\" r=\"6\" />\n<g class=\"star-burst\" id=\"ic-star-burst\"></g>\n<g class=\"asset\" id=\"ic-wave\" transform=\"translate(214 400) rotate(-7) scale(0.875) translate(-56 -43)\">\n<g filter=\"url(#ic-stk-cut)\">\n<path id=\"ic-wave-body\" d=\"M4 74 L4 56 C10 36 28 16 56 12 C82 9 102 22 106 40 C98 31 86 29 78 35 C70 41 71 53 81 56 C89 58 95 53 97 48 C102 60 95 72 82 74 Z\" fill=\"#2fb4d9\" />\n<path d=\"M4 74 L4 64 C30 57 60 67 101 60 C99 68 92 73 82 74 Z\" fill=\"#1c86ad\" />\n<path d=\"M4 74 L4 56 C10 36 28 16 56 12 C82 9 102 22 106 40 C98 31 86 29 78 35 C70 41 71 53 81 56 C89 58 95 53 97 48 C102 60 95 72 82 74 Z\" fill=\"url(#ic-dots)\" />\n<path d=\"M10 54 C18 38 32 24 54 20 C76 17 94 26 99 38\" fill=\"none\" stroke=\"#fff\" stroke-width=\"3.2\" stroke-linecap=\"round\" />\n<path d=\"M100 42 C92 34 80 34 76 42 C73 49 79 55 86 53 C90 52 92 48 90 45\" fill=\"none\" stroke=\"#151412\" stroke-width=\"3\" stroke-linecap=\"round\" />\n<circle cx=\"62\" cy=\"8\" r=\"2.4\" fill=\"#fff\" /><circle cx=\"72\" cy=\"6\" r=\"1.7\" fill=\"#fff\" /><circle cx=\"104\" cy=\"31\" r=\"2.2\" fill=\"#fff\" />\n</g>\n</g>\n<g class=\"asset\" id=\"ic-phone\">\n<rect id=\"ic-ph-edge\" fill=\"#ffffff\" />\n<rect id=\"ic-ph-body\" fill=\"#111111\" />\n<g id=\"ic-ph-screen\">\n<rect x=\"4\" y=\"12\" width=\"46\" height=\"72\" rx=\"3\" fill=\"url(#ic-sunset)\" />\n<rect x=\"4\" y=\"12\" width=\"46\" height=\"72\" rx=\"3\" fill=\"url(#ic-dots)\" />\n<rect x=\"21\" y=\"5\" width=\"12\" height=\"2.6\" rx=\"1.3\" fill=\"#4a4845\" />\n<circle cx=\"27\" cy=\"48\" r=\"12.5\" fill=\"#fffdf7\" />\n<path d=\"M23.5 41.5 L34 48 L23.5 54.5 Z\" fill=\"#ef4a2f\" />\n</g>\n<g id=\"ic-ph-heart\">\n<circle cx=\"27\" cy=\"-2\" r=\"9.5\" fill=\"#fffdf7\" stroke=\"#151412\" stroke-width=\"2\" />\n<path d=\"M27 2.6 C22.6 -0.6 21.4 -2.4 21.8 -4.2 C22.3 -6.2 24.9 -6.7 27 -4.6 C29.1 -6.7 31.7 -6.2 32.2 -4.2 C32.6 -2.4 31.4 -0.6 27 2.6 Z\" fill=\"#ef4a2f\" />\n</g>\n</g>\n<g mask=\"url(#ic-f-pocket)\">\n<g class=\"asset star\" id=\"ic-star-a\" transform=\"translate(332 -112) rotate(6) scale(0.5) translate(-48 -43)\">\n<g filter=\"url(#ic-stk-cut)\">\n<path d=\"M48 10 L56.82 33.87 L82.24 34.88 L62.27 50.64 L69.16 75.12 L48 61 L26.84 75.12 L33.73 50.64 L13.76 34.88 L39.18 33.87 Z\" fill=\"#ef4a2f\" stroke=\"#151412\" stroke-width=\"3\" stroke-linejoin=\"round\" />\n<path d=\"M48 10 L56.82 33.87 L82.24 34.88 L62.27 50.64 L69.16 75.12 L48 61 L26.84 75.12 L33.73 50.64 L13.76 34.88 L39.18 33.87 Z\" fill=\"url(#ic-dots)\" />\n</g>\n</g>\n<g class=\"asset star\" id=\"ic-star-b\" transform=\"translate(302 -132) rotate(-10) scale(0.36) translate(-48 -43)\">\n<g filter=\"url(#ic-stk-cut)\">\n<path d=\"M48 10 L56.82 33.87 L82.24 34.88 L62.27 50.64 L69.16 75.12 L48 61 L26.84 75.12 L33.73 50.64 L13.76 34.88 L39.18 33.87 Z\" fill=\"#f5c518\" stroke=\"#151412\" stroke-width=\"3\" stroke-linejoin=\"round\" />\n<path d=\"M48 10 L56.82 33.87 L82.24 34.88 L62.27 50.64 L69.16 75.12 L48 61 L26.84 75.12 L33.73 50.64 L13.76 34.88 L39.18 33.87 Z\" fill=\"url(#ic-dots)\" />\n</g>\n</g>\n<g class=\"asset star\" id=\"ic-star-c\" transform=\"translate(358 -140) rotate(14) scale(0.26) translate(-48 -43)\">\n<g filter=\"url(#ic-stk-cut)\">\n<path d=\"M48 10 L56.82 33.87 L82.24 34.88 L62.27 50.64 L69.16 75.12 L48 61 L26.84 75.12 L33.73 50.64 L13.76 34.88 L39.18 33.87 Z\" fill=\"#2fb4d9\" stroke=\"#151412\" stroke-width=\"3\" stroke-linejoin=\"round\" />\n<path d=\"M48 10 L56.82 33.87 L82.24 34.88 L62.27 50.64 L69.16 75.12 L48 61 L26.84 75.12 L33.73 50.64 L13.76 34.88 L39.18 33.87 Z\" fill=\"url(#ic-dots)\" />\n</g>\n</g>\n</g>\n"

const clamp = (x: number) => Math.min(1, Math.max(0, x))
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a))
const inOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const out = (x: number) => 1 - Math.pow(1 - x, 3)
const inn = (x: number) => x * x * x
const mix = (a: number, b: number, x: number) => a + (b - a) * x
const bez = (a: number, b: number, c: number, u: number) => (1 - u) * (1 - u) * a + 2 * u * (1 - u) * b + u * u * c

// Easing follows what each thing is doing: arriving → out, leaving or falling → in, travelling → in-out.
const TL = {
  c: { close: [700, 840], fill: [840, 980], peek: [980, 1200], swell: [1200, 1340], flash: [1200, 1380], fly: [1340, 1780], back: [1780, 2000], shrink: [2000, 2140], unfill: [2140, 2280], open: [2220, 2380] },
  tee: { stem: [2440, 2600], bar: [2500, 2700], morph: [3320, 3600] },
  wave: { rise: [2520, 2800], sink: [3120, 3360] },
  stars: { pop: [2720, 3240], gap: 90, burst: 3380, burstGap: 70 },
  phone: { land: [2700, 2900], morph: [3320, 3600] },
  shades: { drop: [3600, 3880], swing: [3880, 4280] },
} as const
export const CRAFT_END = 4320
/** the sunglasses catch on the A's tip */
export const CRAFT_LAND = TL.shades.drop[1]
export const CRAFT_SETTLE = 4300

type Span = readonly [number, number]
const sg = (t: number, s: Span) => seg(t, s[0], s[1])

/** Puts every part in its finished place (also the reduced-motion / no-JS picture). */
export function restCraft(wrap: HTMLElement) {
  const q = (id: string) => wrap.querySelector<SVGGraphicsElement>('#ic-' + id)
  for (const id of ['pola', 'c-glint', 'c-ring', 'wave', 'phone', 'star-a', 'star-b', 'star-c']) {
    const el = q(id)
    el?.style.setProperty('visibility', 'hidden')
    // hidden stickers also leave rendering (see show() in playCraft)
    if (el?.classList.contains('asset')) el.style.setProperty('display', 'none')
  }
  wrap.querySelectorAll<SVGPathElement>('#ic-star-burst path').forEach((p) => (p.style.visibility = 'hidden'))
  q('c-pocket-disc')?.setAttribute('r', '35')
  const arc = q('c-arc')
  if (arc) arc.style.visibility = ''
  const shades = q('shades')
  if (shades) { shades.style.visibility = ''; shades.setAttribute('transform', 'translate(178 -70)') }
  const stem = q('t-stem'), bar = q('t-bar')
  stem?.setAttribute('d', 'M322 -64 L322 -6'); bar?.setAttribute('d', 'M348 -64 L296 -64')
  for (const el of [stem, bar]) if (el) { el.style.strokeDasharray = ''; el.style.strokeDashoffset = ''; el.style.visibility = '' }
}

/** Once the word has settled, the shades stay balanced on the A's tip: each scroll knocks them
 *  into a tilt about the tip, and a damped spring rocks them back to level. Returns a cleanup. */
export function balanceShades(wrap: HTMLElement): () => void {
  const shades = wrap.querySelector<SVGGElement>('#ic-shades')
  if (!shades) return () => {}
  let a = 0, v = 0, raf = 0, last = 0, lastY = window.scrollY
  const draw = () => shades.setAttribute('transform', `translate(178 -70) rotate(${a.toFixed(2)})`)
  const step = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    v += (-90 * a - 6 * v) * dt
    a = Math.max(-22, Math.min(22, a + v * dt))
    draw()
    if (Math.abs(a) > 0.05 || Math.abs(v) > 0.5) raf = requestAnimationFrame(step)
    else { a = v = 0; draw(); raf = 0 }
  }
  const onScroll = () => {
    const y = window.scrollY, dy = y - lastY
    lastY = y
    v += Math.max(-40, Math.min(40, dy)) * 3.5
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(step) }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); a = 0; draw() }
}

/** Plays the headline once. Returns a cleanup that stops it and leaves the finished word. */
export function playCraft(wrap: HTMLElement, svg: SVGSVGElement, onSettled: () => void): () => void {
  const q = (id: string) => wrap.querySelector('#ic-' + id) as SVGGraphicsElement
  // hidden stickers also leave rendering: Firefox and Safari otherwise run the die-cut filter on them every repaint
  const show = (el: SVGElement, on: boolean, render = on) => {
    el.style.visibility = on ? 'visible' : 'hidden'
    if (el.classList.contains('asset')) el.style.display = render ? '' : 'none'
  }
  const place = (el: Element, x: number, y: number, r: number, s: number, ox: number, oy: number) =>
    el.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${r.toFixed(2)})${s === 1 ? '' : ` scale(${s})`} translate(${-ox} ${-oy})`)

  // the screen's top and bottom edges in word units — assets that arrive from outside come in across them
  const inv = svg.getScreenCTM()?.inverse()
  const TOP = inv ? new DOMPoint(0, 0).matrixTransform(inv).y : -260
  const BOTTOM = inv ? new DOMPoint(0, window.innerHeight).matrixTransform(inv).y : 240

  // ── C: closes into a disc that shoots the photo out on a slant and pockets it again ──
  const cArc = q('c-arc'), cRing = q('c-ring'), glint = q('c-glint'), pocketDisc = q('c-pocket-disc'), pola = q('pola')
  const DIR = [-Math.sin(Math.PI / 6), -Math.cos(Math.PI / 6)], TILT = -30
  function cAt(t: number) {
    const C = TL.c
    const ringOn = t >= C.close[0] && t < C.open[1]
    show(cRing, ringOn); cArc.style.visibility = ringOn ? 'hidden' : ''
    if (ringOn) {
      const L = t < C.unfill[0] ? mix(280, 360, inOut(sg(t, C.close))) : mix(360, 280, inOut(sg(t, C.open)))
      const f = t < C.unfill[0] ? inOut(sg(t, C.fill)) : 1 - inOut(sg(t, C.unfill))
      const k = 1 + 0.14 * (t < C.shrink[0] ? out(sg(t, C.swell)) : 1 - inOut(sg(t, C.shrink))) // swells to shoot the photo out
      cRing.setAttribute('r', mix(29, 17.5, f).toFixed(2)); cRing.style.strokeWidth = mix(12, 35, f).toFixed(2)
      cRing.style.strokeDasharray = L >= 359.9 ? 'none' : `${L.toFixed(2)} ${(360 - L).toFixed(2)}`
      cRing.style.strokeDashoffset = (-(180 - L / 2)).toFixed(2)
      cRing.setAttribute('transform', `translate(35 -35) scale(${k.toFixed(3)}) translate(-35 35)`)
      pocketDisc.setAttribute('r', (35 * k).toFixed(2))
    }
    let d = 0, r: number = TILT // distance along the slant: 0 inside the disc, 36 half out, 150 far out
    if (t >= C.peek[0] && t < C.fly[0]) d = mix(0, 36, out(sg(t, C.peek)))
    else if (t >= C.fly[0] && t < C.back[0]) { const u = sg(t, C.fly); d = mix(36, 150, out(u)); r = TILT - 720 * inOut(u) }
    else if (t >= C.back[0] && t < C.back[1]) d = mix(150, 0, inn(sg(t, C.back)))
    show(pola, t >= C.peek[0] && t < C.back[1])
    place(pola, 35 + DIR[0] * d, -35 + DIR[1] * d, r, 0.43, 43, 50)
    const g = seg(t, C.flash[0], C.flash[0] + 200)
    show(glint, g > 0 && g < 1); glint.setAttribute('r', mix(4, 30, out(g)).toFixed(2))
  }

  // ── T: a + first (crossbar level with the F's middle arm, reaching further left), then the T ──
  const tStem = q('t-stem'), tBar = q('t-bar')
  // the +'s right arm ends just inside the phone's edge, so no sliver of it shows beside the phone
  const PLUS = { stem: [-53, -19], x1: 345, x2: 280, y: -36 }, TEE = { stem: [-64, -6], x1: 348, x2: 296, y: -64 }
  function teeAt(t: number) {
    const m = inOut(sg(t, TL.tee.morph))
    tStem.setAttribute('d', `M322 ${mix(PLUS.stem[0], TEE.stem[0], m).toFixed(2)} L322 ${mix(PLUS.stem[1], TEE.stem[1], m).toFixed(2)}`)
    const y = mix(PLUS.y, TEE.y, m)
    tBar.setAttribute('d', `M${mix(PLUS.x1, TEE.x1, m).toFixed(2)} ${y.toFixed(2)} L${mix(PLUS.x2, TEE.x2, m).toFixed(2)} ${y.toFixed(2)}`)
    for (const [el, span] of [[tStem, TL.tee.stem], [tBar, TL.tee.bar]] as const) {
      el.style.strokeDasharray = '1'; el.style.strokeDashoffset = (1 - inOut(sg(t, span))).toFixed(3)
      el.style.visibility = t < span[0] ? 'hidden' : ''
    }
  }

  // ── sunglasses: drop from the top edge, catch on the A's tip, swing to rest ──
  const shades = q('shades')
  function shadesAt(t: number) {
    const S = TL.shades
    if (t < S.drop[0]) { shades.style.visibility = 'hidden'; return }
    shades.style.visibility = ''
    const y = mix(TOP - 30, -70, inn(sg(t, S.drop)))
    const w = sg(t, S.swing), r = t < S.swing[0] ? 0 : 8 * Math.exp(-4 * w) * Math.sin(w * Math.PI * 3.2) * (1 - w)
    shades.setAttribute('transform', `translate(178 ${y.toFixed(2)}) rotate(${r.toFixed(2)})`)
  }

  // ── wave: rolls up from the bottom edge under the A and F, then back down ──
  const wave = q('wave')
  function waveAt(t: number) {
    const W = TL.wave, off = BOTTOM + 50, rest = 36 // crests up through the bottom edge under the A and F
    const y = t < W.sink[0] ? mix(off, rest, out(sg(t, W.rise))) : mix(rest, off, inn(sg(t, W.sink)))
    show(wave, t >= W.rise[0] && t < W.sink[1])
    place(wave, 214, y, -7, 0.875, 56, 43)
  }

  // ── cellphone: lands right on the + with a small settling tilt, then morphs straight into the
  //    T's upright — its black body narrows and squares off to the stroke while the screen and the
  //    heart squeeze away into the middle. No stand-in shape: the body itself becomes the letter.
  //    Everything is symmetric about the T's upright (x 322), including the heart on top. ──
  const phone = q('phone'), phEdge = q('ph-edge'), phBody = q('ph-body'), phScreen = q('ph-screen'), phHeart = q('ph-heart')
  // the phone stands exactly the T's height (cap line to baseline, 70), in a phone's proportions;
  // the artwork is drawn at 54 × 96 and scaled to fit
  const ART = { w: 54, h: 96 }, FIT = 70 / ART.h
  const PH = { cx: 322, cy: -35, w: ART.w * FIT, h: 70, rx: 9 * FIT, edge: 4.5 * FIT }
  function phoneAt(t: number) {
    const P = TL.phone
    show(phone, t >= P.land[0] && t < P.morph[1] + 30)
    if (t < P.land[0]) return
    const m = inOut(sg(t, P.morph))
    const k = clamp(m / 0.6)                                  // the screen is gone by 60% of the morph
    const w = mix(PH.w, 12, m), h = mix(PH.h, 70, m), rx = mix(PH.rx, 0, m), e = PH.edge * (1 - m)
    const bx = PH.cx - w / 2, by = PH.cy - h / 2
    const set = (el: Element, x: number, y: number, ww: number, hh: number, r: number) => {
      el.setAttribute('x', x.toFixed(2)); el.setAttribute('y', y.toFixed(2)); el.setAttribute('width', ww.toFixed(2)); el.setAttribute('height', hh.toFixed(2)); el.setAttribute('rx', r.toFixed(2))
    }
    set(phBody, bx, by, w, h, rx)
    set(phEdge, bx - e, by - e, w + 2 * e, h + 2 * e, rx + e)   // the sticker's white edge thins away with the morph
    const sx = w / ART.w, sy = h / ART.h
    phScreen.setAttribute('transform', `translate(${(bx + w / 2).toFixed(2)} ${by.toFixed(2)}) scale(${(sx * (1 - k)).toFixed(4)} ${sy.toFixed(4)}) translate(-27 0)`)
    phHeart.setAttribute('transform', `translate(${bx.toFixed(2)} ${by.toFixed(2)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)}) translate(27 -2) scale(${(1 - k).toFixed(4)}) translate(-27 2)`) // centred on the upright, so it shrinks down the T's line
    const r = 8 * (1 - out(sg(t, P.land)))                   // lands tilted, settles upright
    phone.setAttribute('transform', `rotate(${r.toFixed(2)} ${PH.cx} ${PH.cy})`)
  }

  // ── stars: pop up out of the F, curve right above the T, then burst into rays of their own colour ──
  const burstBox = q('star-burst')
  // stars and their bursts draw above the phone, which fills the T's slot while they land
  const starLayer = q('star-a').parentElement
  if (starLayer) svg.appendChild(starLayer)
  svg.appendChild(burstBox)
  const STARS = [
    { el: q('star-a'), s: 0.5, from: [248, -40], via: [244, -168], to: [332, -112], r: 6 },
    { el: q('star-b'), s: 0.36, from: [242, -36], via: [232, -190], to: [302, -132], r: -10 },
    { el: q('star-c'), s: 0.26, from: [254, -36], via: [262, -200], to: [358, -140], r: 14 },
  ].map((S, i) => {
    const col = S.el.querySelector('path')?.getAttribute('fill') ?? '#111111', R = 42 * S.s
    const lines = Array.from({ length: 8 }, (_, k) => {
      const a = (k / 8) * Math.PI * 2 + i * 0.3, c = Math.cos(a), n = Math.sin(a)
      const ln = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      ln.setAttribute('pathLength', '1')
      ln.setAttribute('d', `M${(S.to[0] + c * R * 0.55).toFixed(2)} ${(S.to[1] + n * R * 0.55).toFixed(2)} L${(S.to[0] + c * R * 1.6).toFixed(2)} ${(S.to[1] + n * R * 1.6).toFixed(2)}`)
      ln.style.stroke = col; ln.style.strokeWidth = (1.4 + 3.2 * S.s).toFixed(2)
      burstBox.appendChild(ln)
      return ln
    })
    return { ...S, lines, burstAt: TL.stars.burst + i * TL.stars.burstGap }
  })
  function starsAt(t: number) {
    // the three stars leave rendering only together: Safari clips a showing star's die-cut edge
    // while a sibling star is out of rendering
    const anyStar = STARS.some((S, i) => t >= TL.stars.pop[0] + i * TL.stars.gap && t < S.burstAt)
    STARS.forEach((S, i) => {
      const t0s = TL.stars.pop[0] + i * TL.stars.gap
      const u = out(seg(t, t0s, TL.stars.pop[1] + i * TL.stars.gap))
      show(S.el, t >= t0s && t < S.burstAt, anyStar)
      place(S.el, bez(S.from[0], S.via[0], S.to[0], u), bez(S.from[1], S.via[1], S.to[1], u), S.r - 200 * (1 - u), S.s, 48, 43)
      const a1 = seg(t, S.burstAt, S.burstAt + 110), z = seg(t, S.burstAt + 110, S.burstAt + 250)
      S.lines.forEach((ln) => {
        show(ln, a1 > 0 && z < 1)
        ln.style.strokeDasharray = z > 0 ? `${(1 - z).toFixed(3)} 2` : '1 2'
        ln.style.strokeDashoffset = z > 0 ? (-z).toFixed(3) : (1 - out(a1)).toFixed(3)
      })
    })
  }

  let raf = 0
  const t0 = performance.now()
  const frame = (now: number) => {
    const t = now - t0
    cAt(t); teeAt(t); shadesAt(t); waveAt(t); phoneAt(t); starsAt(t)
    if (t < CRAFT_END) raf = requestAnimationFrame(frame)
    else restCraft(wrap)
  }
  frame(t0)
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(frame)
  const settle = window.setTimeout(onSettled, CRAFT_SETTLE)

  return () => {
    cancelAnimationFrame(raf)
    window.clearTimeout(settle)
    STARS.forEach((S) => S.lines.forEach((ln) => ln.remove()))
    restCraft(wrap)
  }
}
