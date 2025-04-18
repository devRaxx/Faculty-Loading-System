# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Design Notes

## Color Styles:
- White: FFFFFF
- Teal: E8FFF8
- Warm Gray: 000000
- Black: 000000
- Green Accent: 035C65
- Background: F9FFFF
- Admin Red: FF6962
- Admin Green: 77DD76
- Pastel Blue: D3EEFF

## Login Page
Gradient - Linear
- Diagonal Slant. Gradient starts from upper left (darker teal shades) to lower left (lighter teal shades)
- Teal Colors (Dark to Light):
  - 07BEB8
  - 38CBC7
  - 68D8D6
  - 96ECE8
  - C4FFF9

## Navigation Bar

When pressed, Icon and Text will have a drop-shadow (X = 0, Y = 2, Blur = 2) with an underline.

## Rounded Corners
- Default: 10px 
- Table, Course Input Fields (in Alpha List, faculty, Bloc), Bloc and Faculty Drop-Down: 5px
- Bloc and Faculty Edit Button: 0px 

## Effects
Buttons
- General:
  - Hover: drop-shadow (X = 0, Y = 2, Blur = 2) and Color: Teal (E8FFF8)
- In Faculty and Bloc Pages after the edit button has been pressed 
  - Hover: drop-shadow (X = 0, Y = 2, Blur = 2) and Color: Teal (E8FFF8), will show the description of the button
Filter in Summary and Alpha List Pages
- Drop-shadow (X = 0, Y = 2, Blur = 2)
Tables
- When hovered, the cell will have a Teal background (E8FFF8)
- If there is an error, cell will have an Admin Red  background

## Fonts
Poppins, Sora: Regular, SemiBold, Bold

## Font Size
Note: Check Font Weights in Figma
General:
- Navigation Bar: 32px
- Buttons: 20px
- Empty File/List: 64px

Pop-up Component:
- Header: 40px
- Text: 24px

Filter Component:
- Header: 30px
- Filter Options: 24px

Amin Dashboard:
- Admin Name: 32px
- Table Header: 26px
- Table Body: 22px

Login Page:
- Login Header: 200px
- Input Field Text: 24px

Landing Page:
- Table Header: 26px
- Table Body: 22px

Help Page:
- Header: 50px
- Body: 22px
- Navigation Buttons: 40px

Landing & Export Page:
- Table Header: 26px
- Table Body: 22px

Summary Page:
- Header: 40px
- Table Header & Body: 23px

Alpha List Page:
- Table Header: 18px
- Table Body: 16px
- New/Edit Course:
  - Header: 24px
  - Input Fields: 14px
  - Required, Optional, Create Features: 12px

Faculty Page:
- Timetable Header: 30px
- Timetable Hour Text: 18px
- Timetable Course Name: 20px
- Faculty Drop-down: 32px
- Filter:
  - Header: 18px
  - Filter Options: 15px
- Faculty Name (Load Table), Edit Button: 22px
- Load Table Body: 18px
- Total Units: 27px
- Table Header & Body: 20px
- Warning Header: 22px
- Warning Body: 16px

Bloc Page:
- Bloc Drop-down: 32px
- Filter:
  - Header: 18px
  - Filter Options: 15px
- Bloc Name (Bloc Table), Edit Button: 22px
- Bloc Table Body: 18px
- Total Units: 27px
- Table Header & Body: 20px
- Warning Header: 22px
- Warning Body: 16px

## Timetable Course Color Categories
- Major: Teal (E8FFF8)
- Minor: Pastel Blue (D3EEFF)
- Error: Admin Red
