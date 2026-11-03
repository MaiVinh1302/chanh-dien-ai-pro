import re

with open('D:/AI_FACTORY/AI_DAO_TAO/chanh-dien-ai-pro/static/overlay.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. UPDATE drawCushion TO RESPECT THE REAL BROWN CUSHIONS IN THE PHOTO
cushion_old_pattern = r'function drawCushion\(ctx, x, y, sc, isVip = false\)[\s\S]*?ctx\.restore\(\);\s*\}'
cushion_new = '''function drawCushion(ctx, x, y, sc, isVip = false, isOccupied = false) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(sc, sc);

        if (!isOccupied) {
            // Hiệu ứng viền vàng thiền môn nhẹ nhàng quanh bồ đoàn sẵn có trên ảnh
            ctx.strokeStyle = "rgba(255, 215, 0, 0.35)";
            ctx.lineWidth = 1.2;
            ctx.shadowColor = "rgba(255, 215, 0, 0.5)";
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.roundRect(-20, -5, 40, 16, 4);
            ctx.stroke();

            // Biểu tượng hoa sen vàng bé nhỏ ở giữa bồ đoàn trống
            ctx.fillStyle = "rgba(255, 215, 0, 0.45)";
            ctx.beginPath();
            ctx.arc(0, 3, 2.5, 0, Math.PI * 2);
            ctx.fill();
        } else if (isVip) {
            // Hào quang VIP
            ctx.strokeStyle = "#ffd700";
            ctx.lineWidth = 1.8;
            ctx.shadowColor = "#ffd700";
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.roundRect(-22, -6, 44, 18, 4);
            ctx.stroke();
        }
        ctx.restore();
    }'''

text = re.sub(cushion_old_pattern, cushion_new, text, count=1)
print("1. Updated drawCushion")

# 2. UPDATE buildSeatsGrid WITH PRECISE CALIBRATED SEATS MAPPING
seats_old_pattern = r'function buildSeatsGrid\(\)\s*\{[\s\S]*?document\.getElementById\("capacity-txt"\)\.innerText = `\$\{devotees\.size\}/\$\{seats\.length\}`;'
seats_new = '''function buildSeatsGrid() {
        seats = [];
        const isPortrait = currentOrientation === "portrait" || (width < height);

        if (currentView === 'main') {
            // TỌA VỊ KHỚP 100% TỪNG CHIẾC BỒ ĐOÀN NÂU TRÊN CHIẾU CÓI TRONG ẢNH
            // Tọa độ chuẩn hóa (x/width, y/height, scale)
            const cushionCoords = [
                // Dãy bên Tả (Bên trái án thờ - Chiếu cói ngoài cùng & trong)
                // Hàng 4 (Gần máy quay nhất)
                { x: 0.156, y: 0.950, sc: 0.88 },
                { x: 0.244, y: 0.950, sc: 0.88 },
                { x: 0.337, y: 0.950, sc: 0.88 },
                // Hàng 3
                { x: 0.190, y: 0.870, sc: 0.72 },
                { x: 0.273, y: 0.870, sc: 0.72 },
                { x: 0.356, y: 0.870, sc: 0.72 },
                // Hàng 2
                { x: 0.225, y: 0.804, sc: 0.58 },
                { x: 0.293, y: 0.804, sc: 0.58 },
                { x: 0.366, y: 0.804, sc: 0.58 },
                // Hàng 1 (Gần cột gỗ & bàn thờ)
                { x: 0.254, y: 0.752, sc: 0.46 },
                { x: 0.317, y: 0.752, sc: 0.46 },
                { x: 0.381, y: 0.752, sc: 0.46 },

                // Dãy bên Hữu (Bên phải án thờ)
                // Hàng 4 (Gần máy quay nhất)
                { x: 0.664, y: 0.950, sc: 0.88 },
                { x: 0.747, y: 0.950, sc: 0.88 },
                { x: 0.835, y: 0.950, sc: 0.88 },
                // Hàng 3
                { x: 0.640, y: 0.870, sc: 0.72 },
                { x: 0.718, y: 0.870, sc: 0.72 },
                { x: 0.796, y: 0.870, sc: 0.72 },
                // Hàng 2
                { x: 0.630, y: 0.804, sc: 0.58 },
                { x: 0.698, y: 0.804, sc: 0.58 },
                { x: 0.767, y: 0.804, sc: 0.58 },
                // Hàng 1 (Gần cột gỗ & bàn thờ)
                { x: 0.620, y: 0.752, sc: 0.46 },
                { x: 0.674, y: 0.752, sc: 0.46 },
                { x: 0.728, y: 0.752, sc: 0.46 },
            ];

            cushionCoords.forEach((c) => {
                seats.push({
                    index: seats.length,
                    x: width * c.x,
                    y: height * c.y,
                    scale: c.sc,
                    occupiedBy: null
                });
            });
        } else if (currentView === 'outward') {
            const vpX = width * 0.50;
            const rows = 3, colsPerSide = 3;
            for (let r = 0; r < rows; r++) {
                const rowProgress = (r + 0.5) / rows;
                const y = height * (0.64 + rowProgress * 0.18);
                const scale = 0.40 + rowProgress * 0.35;
                const aisleGap = width * 0.085;
                const stepCol = width * 0.065;

                for (let c = 0; c < colsPerSide; c++) {
                    const x = vpX - aisleGap - (c * stepCol);
                    seats.push({ index: seats.length, x, y, scale, occupiedBy: null });
                }
                for (let c = 0; c < colsPerSide; c++) {
                    const x = vpX + aisleGap + (c * stepCol);
                    seats.push({ index: seats.length, x, y, scale, occupiedBy: null });
                }
            }
        } else {
            const rows = 3, cols = 5;
            for (let r = 0; r < rows; r++) {
                const rowProgress = (r + 0.5) / rows;
                const y = height * (0.68 + rowProgress * 0.22);
                const scale = 0.45 + rowProgress * 0.40;
                for (let c = 0; c < cols; c++) {
                    const x = width * 0.38 + c * (width * 0.075);
                    seats.push({ index: seats.length, x, y, scale, occupiedBy: null });
                }
            }
        }

        document.getElementById("capacity-txt").innerText = `${devotees.size}/${seats.length}`;'''

text = re.sub(seats_old_pattern, seats_new, text, count=1)
print("2. Updated buildSeatsGrid with calibrated seats")

# 3. UPDATE drawAltar TO MATCH ALTAR TABLE ON PRISTINE HALL
altar_old_pattern = r'function drawAltar\(ctx\)\s*\{[\s\S]*?let altarX = width \* 0\.50;\s*let altarY = height \* 0\.638;'
altar_new = '''function drawAltar(ctx) {
        flamePhase += 0.15;
        const isPortrait = currentOrientation === "portrait" || (width < height);

        let altarX = width * 0.50;
        let altarY = height * 0.655;'''

text = re.sub(altar_old_pattern, altar_new, text, count=1)
print("3. Updated drawAltar height to 0.655")

with open('D:/AI_FACTORY/AI_DAO_TAO/chanh-dien-ai-pro/static/overlay.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Saved overlay.html successfully!")
