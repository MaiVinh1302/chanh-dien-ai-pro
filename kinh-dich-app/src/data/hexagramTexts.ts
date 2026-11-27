export interface HexagramTextEntry {
  thoan: string;
  thoanTruyen: string;
  daiTuong: string;
  haos: string[];
}

export const HEXAGRAM_TEXTS: Record<number, HexagramTextEntry> = {
  "1": {
    "thoan": "Khởi đầu, hanh thông, thuận lợi và bền vững.",
    "thoanTruyen": "Biểu tượng cho sức sáng tạo của Trời, sự vận hành không ngừng và tinh thần tự cường của người quân tử.",
    "daiTuong": "Người quân tử noi theo đạo Trời để không ngừng học tập, rèn luyện và hoàn thiện bản thân.",
    "haos": [
      "Sơ Cửu: tài năng còn tiềm ẩn.",
      "Cửu Nhị: xuất hiện đúng thời.",
      "Cửu Tam: nỗ lực không ngừng.",
      "Cửu Tứ: chuẩn bị tiến lên vị trí cao hơn.",
      "Cửu Ngũ: lãnh đạo chính đáng.",
      "Thượng Cửu: cực thịnh dễ suy.",
      "Dụng Cửu: lấy đức khiêm nhường để điều hòa sức mạnh."
    ]
  },
  "2": {
    "thoan": "Tiếp nhận, nâng đỡ, nuôi dưỡng và hoàn thành. Thành công đến từ sự khiêm tốn, bền bỉ và thuận theo quy luật.",
    "thoanTruyen": "Quẻ Khôn tượng trưng cho Đất, mang đức tính bao dung và tiếp nhận. Sức mạnh của Khôn nằm ở khả năng hỗ trợ, nuôi dưỡng và hoàn thành những gì đã được khởi đầu.",
    "daiTuong": "Người quân tử noi theo đức của đất, lấy sự rộng lượng, kiên nhẫn và trách nhiệm để nâng đỡ người khác và hoàn thành công việc.",
    "haos": [
      "Sơ Lục: dấu hiệu ban đầu của thay đổi cần được chú ý.",
      "Lục Nhị: trung chính, thuận đức và đáng tin cậy.",
      "Lục Tam: làm việc âm thầm, không tranh công.",
      "Lục Tứ: thận trọng, giữ đúng vị trí của mình.",
      "Lục Ngũ: đức khiêm nhường đem lại thành công lớn.",
      "Thượng Lục: cực thịnh dễ dẫn đến xung đột.",
      "Dụng Lục: lấy nhu thuận để duy trì sự bền vững."
    ]
  },
  "3": {
    "thoan": "Khởi đầu thường gặp trở ngại. Muốn thành công cần kiên nhẫn, chuẩn bị kỹ lưỡng và tìm được người hỗ trợ phù hợp.",
    "thoanTruyen": "Quẻ Truân biểu tượng cho giai đoạn hình thành còn nhiều khó khăn. Tuy hoàn cảnh chưa thuận lợi, nhưng đây là thời kỳ cần gieo nền móng cho sự phát triển lâu dài.",
    "daiTuong": "Người quân tử biết tổ chức công việc, quy tụ nhân tâm và từng bước giải quyết khó khăn thay vì nóng vội tìm kết quả ngay.",
    "haos": [
      "Sơ Cửu: giai đoạn đầu còn nhiều trở ngại nhưng không nên bỏ cuộc.",
      "Lục Nhị: cần kiên nhẫn chờ thời cơ thích hợp.",
      "Lục Tam: hành động đơn độc dễ gặp thất bại.",
      "Lục Tứ: biết tìm người hỗ trợ sẽ vượt qua khó khăn.",
      "Cửu Ngũ: giữ vững vị trí trung tâm để ổn định tình hình.",
      "Thượng Lục: kéo dài khó khăn vì mất phương hướng.",
      "Ý nghĩa chung: kiên trì và chuẩn bị là chìa khóa vượt qua giai đoạn khởi đầu."
    ]
  },
  "4": {
    "thoan": "Thời kỳ chưa hiểu biết cần được chỉ dẫn đúng đắn. Học hỏi với thái độ khiêm tốn sẽ giúp mở mang trí tuệ và trưởng thành.",
    "thoanTruyen": "Quẻ Mông tượng trưng cho sự non trẻ và thiếu kinh nghiệm. Muốn phát triển cần có người hướng dẫn, đồng thời phải giữ tinh thần cầu học và biết tự rèn luyện bản thân.",
    "daiTuong": "Người quân tử dùng giáo dục và kỷ luật để khai mở nhận thức, giúp bản thân và người khác từng bước thoát khỏi sự mê mờ.",
    "haos": [
      "Sơ Lục: cần được hướng dẫn ngay từ đầu để tránh sai lầm.",
      "Cửu Nhị: người có năng lực nên kiên nhẫn dìu dắt người mới.",
      "Lục Tam: ham muốn nhất thời dễ làm mất phương hướng.",
      "Lục Tứ: thiếu người hướng dẫn nên dễ lâm vào cô lập.",
      "Lục Ngũ: giữ tinh thần học hỏi sẽ nhận được lợi ích lớn.",
      "Thượng Cửu: giáo dục nghiêm khắc nhưng không cực đoan.",
      "Ý nghĩa chung: lấy học tập và rèn luyện làm nền tảng phát triển."
    ]
  },
  "5": {
    "thoan": "Khi thời cơ chưa đến, điều quan trọng là giữ vững niềm tin, tích lũy năng lực và kiên nhẫn chờ đợi.",
    "thoanTruyen": "Quẻ Nhu tượng trưng cho hoàn cảnh cần thời gian để phát triển chín muồi. Hành động vội vàng thường không đem lại kết quả tốt, trong khi sự chuẩn bị kỹ lưỡng giúp tạo nền tảng vững chắc.",
    "daiTuong": "Người quân tử biết nuôi dưỡng đức hạnh, giữ tâm bình tĩnh và chuẩn bị đầy đủ trước khi hành động.",
    "haos": [
      "Sơ Cửu: kiên nhẫn chuẩn bị từ những bước đầu tiên.",
      "Cửu Nhị: gặp khó khăn nhỏ nhưng vẫn giữ được định hướng.",
      "Cửu Tam: nóng vội dễ dẫn đến rủi ro và tổn thất.",
      "Lục Tứ: biết giữ mình và tránh đối đầu không cần thiết.",
      "Cửu Ngũ: trung chính và kiên trì sẽ đợi được thời cơ tốt.",
      "Thượng Lục: kết quả đến sau quá trình chờ đợi và chuẩn bị lâu dài.",
      "Ý nghĩa chung: biết chờ đúng lúc là một dạng của trí tuệ."
    ]
  },
  "6": {
    "thoan": "Khi xuất hiện tranh chấp, cần giữ lý trí và tìm giải pháp công bằng thay vì đối đầu đến cùng.",
    "thoanTruyen": "Quẻ Tụng tượng trưng cho bất đồng và xung đột phát sinh từ khác biệt lợi ích hoặc quan điểm. Thành công không nằm ở việc thắng thua mà ở khả năng giải quyết mâu thuẫn đúng đắn.",
    "daiTuong": "Người quân tử cân nhắc kỹ lưỡng trước khi hành động và luôn ưu tiên sự công bằng trong mọi quyết định.",
    "haos": [
      "Sơ Lục: mâu thuẫn nhỏ nên giải quyết sớm để tránh kéo dài.",
      "Cửu Nhị: biết nhường nhịn đúng lúc sẽ giảm tổn thất.",
      "Lục Tam: cố chấp dễ khiến tranh chấp trở nên phức tạp.",
      "Cửu Tứ: lắng nghe và điều chỉnh giúp hóa giải đối đầu.",
      "Cửu Ngũ: công tâm và chính trực tạo được sự tín phục.",
      "Thượng Cửu: theo đuổi thắng lợi bằng mọi giá dễ dẫn đến hậu quả không mong muốn.",
      "Ý nghĩa chung: dùng lý trí và công bằng để xử lý bất đồng."
    ]
  },
  "7": {
    "thoan": "Muốn hoàn thành việc lớn cần có tổ chức, kỷ luật và người dẫn dắt đáng tin cậy.",
    "thoanTruyen": "Quẻ Sư tượng trưng cho sức mạnh tập thể được điều phối đúng cách. Thành công đến từ kỷ luật, trách nhiệm và khả năng quy tụ nhiều người vào cùng một mục tiêu.",
    "daiTuong": "Người quân tử biết xây dựng trật tự, dùng năng lực quản lý để tập hợp nguồn lực và duy trì sự ổn định lâu dài.",
    "haos": [
      "Sơ Lục: ngay từ đầu phải thiết lập kỷ luật rõ ràng.",
      "Cửu Nhị: người lãnh đạo cần công bằng và được mọi người tín nhiệm.",
      "Lục Tam: thiếu phối hợp dễ dẫn đến thất bại.",
      "Lục Tứ: biết dừng đúng lúc sẽ giảm tổn thất.",
      "Lục Ngũ: sử dụng nhân tài đúng vị trí giúp tập thể phát triển.",
      "Thượng Lục: sau thành công cần giữ sự khiêm tốn và ổn định.",
      "Ý nghĩa chung: sức mạnh tập thể chỉ phát huy khi có tổ chức và kỷ luật."
    ]
  },
  "8": {
    "thoan": "Sự đoàn kết và hợp tác đúng đắn giúp tạo nên sức mạnh bền vững và mang lại thành công lâu dài.",
    "thoanTruyen": "Quẻ Tỷ tượng trưng cho sự đồng lòng giữa con người với con người. Khi các cá nhân cùng hướng đến mục tiêu chung và xây dựng niềm tin lẫn nhau, tập thể sẽ trở nên vững mạnh.",
    "daiTuong": "Người quân tử biết kết giao đúng người, xây dựng sự tin cậy và dùng tinh thần hợp tác để tạo nên thành quả chung.",
    "haos": [
      "Sơ Lục: kết nối bằng sự chân thành ngay từ đầu.",
      "Lục Nhị: giữ trung thực sẽ duy trì được sự gắn bó lâu dài.",
      "Lục Tam: kết giao sai người dễ dẫn đến rắc rối.",
      "Lục Tứ: biết hợp tác đúng cách giúp công việc tiến triển thuận lợi.",
      "Cửu Ngũ: trở thành trung tâm quy tụ và dẫn dắt tập thể.",
      "Thượng Lục: cô lập bản thân sẽ làm suy yếu sự hỗ trợ từ người khác.",
      "Ý nghĩa chung: xây dựng niềm tin là nền tảng của mọi mối quan hệ bền vững."
    ]
  },
  "9": {
    "thoan": "Những thành quả lớn được tạo nên từ sự tích lũy nhỏ và bền bỉ. Cần biết kiềm chế và chuẩn bị trước khi tiến xa hơn.",
    "thoanTruyen": "Quẻ Tiểu Súc tượng trưng cho giai đoạn tích lũy nguồn lực và hoàn thiện bản thân. Tuy chưa thích hợp để bứt phá mạnh mẽ, nhưng đây là thời kỳ quan trọng để tạo nền tảng cho thành công về sau.",
    "daiTuong": "Người quân tử chú trọng rèn luyện năng lực, bồi dưỡng phẩm chất và từng bước hoàn thiện mình trước khi đảm nhận việc lớn.",
    "haos": [
      "Sơ Cửu: quay về với mục tiêu đúng đắn sẽ tránh được sai lầm.",
      "Cửu Nhị: kiên trì theo con đường chính giúp duy trì tiến bộ.",
      "Cửu Tam: nóng vội và thiếu hòa hợp dễ gây trở ngại.",
      "Lục Tứ: biết mềm dẻo sẽ hóa giải được căng thẳng và áp lực.",
      "Cửu Ngũ: tích lũy niềm tin và nguồn lực tạo nên sức mạnh lâu dài.",
      "Thượng Cửu: khi điều kiện đã chín muồi có thể tiến lên, nhưng vẫn cần giữ sự thận trọng.",
      "Ý nghĩa chung: tích lũy đều đặn hôm nay sẽ tạo nền tảng cho thành công ngày mai."
    ]
  },
  "10": {
    "thoan": "Muốn tiến xa cần biết giữ lễ nghĩa, cư xử đúng mực và hành động thận trọng trong từng bước đi.",
    "thoanTruyen": "Quẻ Lý tượng trưng cho cách ứng xử phù hợp với hoàn cảnh và vị thế của mình. Khi biết tôn trọng nguyên tắc, giữ sự khiêm nhường và hành động đúng đắn, con người sẽ tránh được nhiều rủi ro không cần thiết.",
    "daiTuong": "Người quân tử dùng lễ nghi và đạo đức để điều chỉnh hành vi, từ đó xây dựng sự ổn định và lòng tin trong các mối quan hệ.",
    "haos": [
      "Sơ Cửu: khởi đầu bằng thái độ chân thành và đúng mực.",
      "Cửu Nhị: giữ sự ngay thẳng giúp con đường phía trước thuận lợi.",
      "Lục Tam: tự cao hoặc thiếu thận trọng dễ dẫn đến sai lầm.",
      "Cửu Tứ: biết dè dặt và cân nhắc trước khi hành động.",
      "Cửu Ngũ: giữ vai trò lãnh đạo bằng đạo đức và trách nhiệm.",
      "Thượng Cửu: thành công lâu dài nhờ luôn giữ được chuẩn mực.",
      "Ý nghĩa chung: lễ nghĩa và sự cẩn trọng giúp tạo nền tảng vững chắc cho mọi bước tiến."
    ]
  },
  "11": {
    "thoan": "Khi các điều kiện thuận lợi gặp nhau, sự phát triển và hài hòa sẽ xuất hiện một cách tự nhiên.",
    "thoanTruyen": "Quẻ Thái tượng trưng cho thời kỳ thông suốt giữa con người và hoàn cảnh xung quanh. Đây là giai đoạn thuận lợi để xây dựng, phát triển và mở rộng những giá trị tốt đẹp.",
    "daiTuong": "Người quân tử biết duy trì sự cân bằng và hòa hợp để tạo nên môi trường ổn định cho mọi người cùng phát triển.",
    "haos": [
      "Sơ Cửu: khởi đầu thuận lợi nhờ cùng chí hướng với người khác.",
      "Cửu Nhị: giữ sự trung chính sẽ duy trì được trạng thái tốt đẹp.",
      "Cửu Tam: thuận lợi cũng cần đề phòng chủ quan.",
      "Lục Tứ: biết chia sẻ và hợp tác giúp thành công bền vững.",
      "Lục Ngũ: vị trí trung tâm cần dùng đức để dẫn dắt.",
      "Thượng Lục: thịnh vượng đến cực điểm cần chuẩn bị cho thay đổi.",
      "Ý nghĩa chung: duy trì sự cân bằng trong lúc thuận lợi quan trọng không kém việc vượt khó."
    ]
  },
  "12": {
    "thoan": "Khi hoàn cảnh không thuận lợi, điều quan trọng là giữ vững nguyên tắc và chờ thời cơ thích hợp.",
    "thoanTruyen": "Quẻ Bĩ tượng trưng cho giai đoạn bế tắc khi các yếu tố tích cực và tiêu cực không còn hòa hợp. Đây là thời kỳ cần giữ vững phẩm chất và tránh những hành động nóng vội.",
    "daiTuong": "Người quân tử giữ đạo đức và lập trường đúng đắn ngay cả khi môi trường xung quanh không thuận lợi.",
    "haos": [
      "Sơ Lục: khó khăn ban đầu cần được nhận diện sớm.",
      "Lục Nhị: giữ chính đạo sẽ vượt qua nghịch cảnh.",
      "Lục Tam: hành động sai lệch dễ làm tình hình tồi tệ hơn.",
      "Cửu Tứ: xuất hiện cơ hội cải thiện hoàn cảnh.",
      "Cửu Ngũ: kiên định giúp tạo bước chuyển biến tích cực.",
      "Thượng Cửu: thời kỳ bế tắc dần kết thúc.",
      "Ý nghĩa chung: giữ vững giá trị cốt lõi trong lúc khó khăn."
    ]
  },
  "13": {
    "thoan": "Khi mọi người cùng chung mục tiêu và lý tưởng, sức mạnh tập thể sẽ được phát huy tối đa.",
    "thoanTruyen": "Quẻ Đồng Nhân tượng trưng cho sự đoàn kết và hợp tác chân thành. Thành công đến từ khả năng kết nối con người bằng sự tin cậy và mục tiêu chung.",
    "daiTuong": "Người quân tử biết tôn trọng sự khác biệt và xây dựng tinh thần cộng tác vì lợi ích chung.",
    "haos": [
      "Sơ Cửu: kết giao chân thành tạo nền tảng tốt đẹp.",
      "Lục Nhị: hợp tác cần xuất phát từ sự tin cậy.",
      "Cửu Tam: bè phái và thiên vị dễ gây chia rẽ.",
      "Cửu Tứ: vượt qua khác biệt để hướng tới mục tiêu chung.",
      "Cửu Ngũ: lãnh đạo bằng sự công tâm tạo nên đoàn kết.",
      "Thượng Cửu: kết nối bền vững dựa trên giá trị lâu dài.",
      "Ý nghĩa chung: đoàn kết chân thành tạo nên sức mạnh lớn."
    ]
  },
  "14": {
    "thoan": "Sự giàu có và thành công cần được quản lý bằng đức độ và trách nhiệm.",
    "thoanTruyen": "Quẻ Đại Hữu tượng trưng cho sự sung túc về vật chất hoặc tinh thần. Điều quan trọng không phải là sở hữu nhiều mà là biết sử dụng những gì mình có một cách đúng đắn.",
    "daiTuong": "Người quân tử dùng sự thịnh vượng để tạo lợi ích cho cộng đồng thay vì chỉ phục vụ lợi ích riêng.",
    "haos": [
      "Sơ Cửu: thành công ban đầu cần đi cùng sự khiêm tốn.",
      "Cửu Nhị: biết chia sẻ nguồn lực tạo thêm giá trị.",
      "Cửu Tam: năng lực lớn đi kèm trách nhiệm lớn.",
      "Cửu Tứ: tránh tự mãn khi đạt thành tựu.",
      "Lục Ngũ: dùng đức độ để duy trì sự thịnh vượng.",
      "Thượng Cửu: phúc lớn đến từ cách sử dụng thành quả đúng đắn.",
      "Ý nghĩa chung: thành công bền vững cần đi cùng trách nhiệm."
    ]
  },
  "15": {
    "thoan": "Sự khiêm nhường giúp con người tiếp tục học hỏi và phát triển ngay cả khi đã đạt thành tựu.",
    "thoanTruyen": "Quẻ Khiêm tượng trưng cho đức tính biết hạ mình và tôn trọng người khác. Đây là nền tảng giúp duy trì các mối quan hệ tốt đẹp và tạo nên thành công lâu dài.",
    "daiTuong": "Người quân tử không khoe khoang thành tựu mà dùng sự khiêm tốn để hoàn thiện bản thân mỗi ngày.",
    "haos": [
      "Sơ Lục: khiêm nhường từ những việc nhỏ nhất.",
      "Lục Nhị: đức khiêm tốn giúp nhận được sự tin tưởng.",
      "Cửu Tam: có công lao nhưng không tranh công.",
      "Lục Tứ: biết lắng nghe giúp tránh sai lầm.",
      "Lục Ngũ: vị trí cao vẫn giữ được sự giản dị.",
      "Thượng Lục: khiêm nhường mang lại uy tín lâu dài.",
      "Ý nghĩa chung: càng thành công càng cần giữ sự khiêm tốn."
    ]
  },
  "16": {
    "thoan": "Tinh thần tích cực và sự chuẩn bị chu đáo giúp tạo động lực để thực hiện những mục tiêu lớn.",
    "thoanTruyen": "Quẻ Dự tượng trưng cho niềm vui và sự phấn khởi đúng lúc. Khi con người có chung niềm tin và mục tiêu, tập thể sẽ dễ dàng tạo nên sức mạnh lớn.",
    "daiTuong": "Người quân tử dùng sự lạc quan và tổ chức tốt để khích lệ mọi người cùng tiến về phía trước.",
    "haos": [
      "Sơ Lục: niềm vui thiếu nền tảng dễ dẫn đến chủ quan.",
      "Lục Nhị: giữ sự cân bằng giúp duy trì tinh thần ổn định.",
      "Lục Tam: vui vẻ quá mức dễ làm mất tập trung.",
      "Cửu Tứ: biết truyền cảm hứng cho người khác.",
      "Lục Ngũ: giữ vị trí trung tâm bằng sự chân thành.",
      "Thượng Lục: mê đắm niềm vui có thể gây hậu quả đáng tiếc.",
      "Ý nghĩa chung: niềm vui cần đi cùng trách nhiệm và tỉnh táo."
    ]
  },
  "17": {
    "thoan": "Biết thích ứng với hoàn cảnh và thuận theo điều đúng đắn sẽ mang lại kết quả tốt đẹp.",
    "thoanTruyen": "Quẻ Tùy tượng trưng cho khả năng linh hoạt trong hành động và suy nghĩ. Thuận theo ở đây không phải là phụ thuộc, mà là biết thích nghi với quy luật và thời thế.",
    "daiTuong": "Người quân tử biết lắng nghe, học hỏi và điều chỉnh bản thân để hòa hợp với hoàn cảnh.",
    "haos": [
      "Sơ Cửu: bắt đầu bằng tinh thần cởi mở giúp tạo cơ hội mới.",
      "Lục Nhị: lựa chọn đúng người để đồng hành.",
      "Lục Tam: chạy theo điều sai lầm sẽ gặp trở ngại.",
      "Cửu Tứ: linh hoạt nhưng vẫn giữ nguyên tắc.",
      "Cửu Ngũ: theo đuổi điều thiện sẽ được mọi người ủng hộ.",
      "Thượng Lục: trung thành với giá trị đúng đắn đến cuối cùng.",
      "Ý nghĩa chung: thích nghi tốt giúp vượt qua nhiều thay đổi."
    ]
  },
  "18": {
    "thoan": "Những vấn đề tồn đọng cần được nhận diện và xử lý dứt điểm để tạo nền tảng cho sự phát triển mới.",
    "thoanTruyen": "Quẻ Cổ tượng trưng cho việc cải sửa những sai sót tích tụ theo thời gian. Muốn tiến bộ cần nhìn thẳng vào vấn đề và chủ động thay đổi.",
    "daiTuong": "Người quân tử dùng sự tỉnh táo và trách nhiệm để khắc phục sai lầm, cải thiện hiện trạng.",
    "haos": [
      "Sơ Lục: nhận ra sai sót là bước đầu của thay đổi.",
      "Cửu Nhị: sửa chữa bằng tinh thần trách nhiệm.",
      "Cửu Tam: cải cách cần quyết tâm nhưng tránh cực đoan.",
      "Lục Tứ: chần chừ dễ khiến vấn đề kéo dài.",
      "Lục Ngũ: xử lý đúng gốc rễ sẽ đem lại chuyển biến tích cực.",
      "Thượng Cửu: hoàn thành việc sửa chữa và mở ra giai đoạn mới.",
      "Ý nghĩa chung: dũng cảm sửa sai là nền tảng của trưởng thành."
    ]
  },
  "19": {
    "thoan": "Sự phát triển tốt đẹp bắt đầu từ việc quan tâm, thấu hiểu và đến gần với nhu cầu thực tế.",
    "thoanTruyen": "Quẻ Lâm tượng trưng cho thời kỳ thuận lợi để lãnh đạo, hướng dẫn và hỗ trợ người khác. Đây là lúc chủ động tiếp cận và tạo dựng ảnh hưởng tích cực.",
    "daiTuong": "Người quân tử dùng lòng chân thành để hiểu và giúp đỡ người khác phát triển.",
    "haos": [
      "Sơ Cửu: chủ động tiếp cận tạo nên cơ hội mới.",
      "Cửu Nhị: chân thành giúp xây dựng niềm tin.",
      "Lục Tam: thiếu quan tâm dễ tạo khoảng cách.",
      "Lục Tứ: biết lắng nghe sẽ thấu hiểu hơn.",
      "Lục Ngũ: lãnh đạo bằng sự gần gũi và trách nhiệm.",
      "Thượng Lục: duy trì ảnh hưởng tích cực bằng sự bền bỉ.",
      "Ý nghĩa chung: thành công lớn bắt đầu từ sự quan tâm đúng cách."
    ]
  },
  "20": {
    "thoan": "Quan sát kỹ lưỡng trước khi hành động giúp đưa ra quyết định đúng đắn và hạn chế sai lầm.",
    "thoanTruyen": "Quẻ Quán tượng trưng cho khả năng nhìn nhận sự việc từ góc độ rộng hơn. Hiểu rõ bản thân và hoàn cảnh là nền tảng để phát triển bền vững.",
    "daiTuong": "Người quân tử thường xuyên tự xem xét mình và quan sát thế giới để tích lũy trí tuệ.",
    "haos": [
      "Sơ Lục: quan sát còn hạn chế nên cần học hỏi thêm.",
      "Lục Nhị: nhìn nhận bằng sự chân thành và khách quan.",
      "Lục Tam: biết nhìn lại bản thân để điều chỉnh hành vi.",
      "Lục Tứ: mở rộng góc nhìn giúp hiểu sâu hơn.",
      "Cửu Ngũ: quan sát thấu đáo tạo nên quyết định sáng suốt.",
      "Thượng Cửu: trí tuệ đến từ sự chiêm nghiệm lâu dài.",
      "Ý nghĩa chung: hiểu rõ trước khi hành động sẽ giảm nhiều sai lầm."
    ]
  },
  "21": {
    "thoan": "Muốn tiến lên cần dũng cảm đối diện và tháo gỡ những trở ngại đang cản đường.",
    "thoanTruyen": "Quẻ Cắn Cắn tượng trưng cho quá trình giải quyết các vấn đề tồn đọng để khôi phục sự thông suốt. Khi nhìn thẳng vào khó khăn và xử lý đúng cách, sự phát triển sẽ tiếp tục.",
    "daiTuong": "Người quân tử không né tránh vấn đề mà kiên trì tìm giải pháp để cải thiện hoàn cảnh.",
    "haos": [
      "Sơ Cửu: sai sót nhỏ cần được nhận ra và chỉnh sửa sớm.",
      "Lục Nhị: giải quyết vấn đề bằng sự công bằng và tỉnh táo.",
      "Lục Tam: chần chừ khiến trở ngại kéo dài hơn cần thiết.",
      "Cửu Tứ: kiên trì giúp vượt qua khó khăn lớn.",
      "Lục Ngũ: sự công chính tạo được niềm tin từ mọi người.",
      "Thượng Cửu: quá cứng nhắc có thể tạo thêm trở ngại mới.",
      "Ý nghĩa chung: vượt qua trở ngại giúp mở đường cho sự phát triển."
    ]
  },
  "22": {
    "thoan": "Vẻ đẹp thực sự đến từ sự hài hòa giữa hình thức và giá trị bên trong.",
    "thoanTruyen": "Quẻ Bí tượng trưng cho việc làm đẹp và hoàn thiện biểu hiện bên ngoài. Tuy nhiên, hình thức chỉ có ý nghĩa khi phản ánh đúng phẩm chất và nội dung bên trong.",
    "daiTuong": "Người quân tử chú trọng cả đạo đức lẫn cách thể hiện để tạo nên sự hài hòa trong cuộc sống.",
    "haos": [
      "Sơ Cửu: vẻ đẹp từ sự giản dị và chân thành.",
      "Lục Nhị: biết chăm chút những điều cần thiết.",
      "Cửu Tam: không nên quá chú trọng hình thức.",
      "Lục Tứ: nét đẹp tự nhiên có giá trị lâu bền.",
      "Lục Ngũ: nội dung tốt đẹp làm tăng giá trị bên ngoài.",
      "Thượng Cửu: giản dị là vẻ đẹp cao nhất.",
      "Ý nghĩa chung: nội dung luôn quan trọng hơn hình thức."
    ]
  },
  "23": {
    "thoan": "Khi nền tảng bị suy yếu, cần tập trung bảo tồn giá trị cốt lõi và tránh mạo hiểm không cần thiết.",
    "thoanTruyen": "Quẻ Bác tượng trưng cho thời kỳ suy giảm và mất cân bằng. Đây không phải lúc để mở rộng mà là thời điểm củng cố nền móng và chờ đợi cơ hội phục hồi.",
    "daiTuong": "Người quân tử giữ vững đạo đức và nguyên tắc trong lúc hoàn cảnh bất lợi.",
    "haos": [
      "Sơ Lục: dấu hiệu suy giảm xuất hiện từ những điều nhỏ.",
      "Lục Nhị: nền tảng bắt đầu chịu tác động rõ rệt.",
      "Lục Tam: cần tỉnh táo để nhận ra nguy cơ.",
      "Lục Tứ: bảo vệ giá trị cốt lõi để giảm tổn thất.",
      "Lục Ngũ: vẫn còn cơ hội duy trì điều tốt đẹp.",
      "Thượng Cửu: sau suy giảm sẽ mở ra cơ hội tái thiết.",
      "Ý nghĩa chung: biết giữ gốc rễ trong thời kỳ khó khăn."
    ]
  },
  "24": {
    "thoan": "Sau thời kỳ khó khăn, sự hồi phục bắt đầu từ những bước nhỏ nhưng đúng hướng.",
    "thoanTruyen": "Quẻ Phục tượng trưng cho sự quay trở lại của điều tích cực sau giai đoạn suy giảm. Đây là thời điểm thích hợp để điều chỉnh, làm mới và bắt đầu lại.",
    "daiTuong": "Người quân tử biết nhìn lại bản thân và quay về với những giá trị đúng đắn.",
    "haos": [
      "Sơ Cửu: trở lại con đường đúng từ rất sớm.",
      "Lục Nhị: phục hồi bằng sự chân thành và khiêm tốn.",
      "Lục Tam: còn do dự nhưng đã nhận ra hướng đi đúng.",
      "Lục Tứ: kiên trì giúp quá trình hồi phục vững chắc hơn.",
      "Lục Ngũ: giữ cân bằng trong giai đoạn phát triển trở lại.",
      "Thượng Lục: bỏ lỡ cơ hội thay đổi sẽ kéo dài khó khăn.",
      "Ý nghĩa chung: phục hồi bắt đầu từ việc sửa mình."
    ]
  },
  "25": {
    "thoan": "Hành động xuất phát từ sự chân thành và chính trực sẽ mang lại kết quả tốt đẹp hơn mọi toan tính thiếu thực tế.",
    "thoanTruyen": "Quẻ Vô Vọng tượng trưng cho sự chân thật và thuận theo lẽ tự nhiên. Khi loại bỏ những ham muốn và suy nghĩ lệch lạc, con người sẽ hành động đúng đắn hơn.",
    "daiTuong": "Người quân tử lấy sự trung thực làm nền tảng cho mọi quyết định và hành động.",
    "haos": [
      "Sơ Cửu: giữ sự ngay thẳng từ đầu sẽ tránh sai lầm.",
      "Lục Nhị: chân thành giúp công việc tiến triển thuận lợi.",
      "Lục Tam: hành động theo cảm tính dễ gây tổn thất.",
      "Cửu Tứ: giữ đúng nguyên tắc trước áp lực bên ngoài.",
      "Cửu Ngũ: sự chính trực tạo ảnh hưởng tích cực.",
      "Thượng Cửu: cố chấp vào điều sai sẽ dẫn đến khó khăn.",
      "Ý nghĩa chung: sống đúng với giá trị thật của bản thân."
    ]
  },
  "26": {
    "thoan": "Sức mạnh thực sự đến từ quá trình tích lũy kiến thức, kinh nghiệm và khả năng tự kiểm soát bản thân.",
    "thoanTruyen": "Quẻ Đại Súc tượng trưng cho việc tích lũy nguồn lực và phát triển nội lực. Khi biết kiên trì rèn luyện và chuẩn bị lâu dài, con người sẽ có đủ khả năng đảm nhận trách nhiệm lớn hơn.",
    "daiTuong": "Người quân tử không ngừng học hỏi và hoàn thiện bản thân để tạo nền tảng vững chắc cho tương lai.",
    "haos": [
      "Sơ Cửu: cần học cách kiềm chế những hành động nóng vội.",
      "Cửu Nhị: tích lũy từng bước tạo nên sự tiến bộ bền vững.",
      "Cửu Tam: nỗ lực lâu dài giúp mở rộng năng lực.",
      "Lục Tứ: biết giữ kỷ luật sẽ hạn chế được sai lầm.",
      "Lục Ngũ: dùng trí tuệ để quản lý nguồn lực đã tích lũy.",
      "Thượng Cửu: thành quả lớn đến từ sự bền bỉ và tự chủ.",
      "Ý nghĩa chung: tích lũy hôm nay là nền tảng cho thành công ngày mai."
    ]
  },
  "27": {
    "thoan": "Muốn phát triển lâu dài cần biết nuôi dưỡng cả thân thể, trí tuệ và phẩm chất của bản thân.",
    "thoanTruyen": "Quẻ Di tượng trưng cho việc nuôi dưỡng và bồi đắp những điều thiết yếu trong cuộc sống. Chất lượng của những gì ta tiếp nhận sẽ ảnh hưởng trực tiếp đến sự phát triển của bản thân.",
    "daiTuong": "Người quân tử chú trọng việc học tập, rèn luyện và lựa chọn những giá trị tích cực để nuôi dưỡng tâm trí.",
    "haos": [
      "Sơ Cửu: cần xây dựng nền tảng vững chắc ngay từ đầu.",
      "Lục Nhị: tiếp nhận điều đúng đắn giúp phát triển ổn định.",
      "Lục Tam: lựa chọn sai nguồn nuôi dưỡng dễ gây tổn hại.",
      "Lục Tứ: biết chăm sóc bản thân và người khác đúng cách.",
      "Lục Ngũ: giữ cân bằng trong việc cho và nhận.",
      "Thượng Cửu: thành quả phản ánh những gì đã tích lũy từ trước.",
      "Ý nghĩa chung: sự phát triển bền vững bắt đầu từ việc nuôi dưỡng đúng đắn."
    ]
  },
  "28": {
    "thoan": "Khi trách nhiệm vượt quá bình thường, cần bản lĩnh và sự cân bằng để không bị quá tải.",
    "thoanTruyen": "Quẻ Đại Quá tượng trưng cho thời kỳ phải đảm nhận trọng trách lớn hoặc đối mặt với áp lực vượt mức thông thường. Thành công đòi hỏi sự kiên định và khả năng thích nghi.",
    "daiTuong": "Người quân tử giữ vững nguyên tắc và tinh thần trách nhiệm ngay cả trong hoàn cảnh khó khăn.",
    "haos": [
      "Sơ Lục: chuẩn bị kỹ giúp giảm áp lực về sau.",
      "Cửu Nhị: giữ cân bằng trong lúc đảm nhận trách nhiệm lớn.",
      "Cửu Tam: gánh vác quá sức dễ dẫn đến mệt mỏi và sai sót.",
      "Cửu Tứ: linh hoạt giúp vượt qua thách thức.",
      "Cửu Ngũ: dùng kinh nghiệm để ổn định tình hình.",
      "Thượng Lục: biết dừng đúng lúc để tránh kiệt sức.",
      "Ý nghĩa chung: sức mạnh cần đi cùng sự cân bằng."
    ]
  },
  "29": {
    "thoan": "Trong hoàn cảnh nhiều thử thách, sự kiên trì và bình tĩnh sẽ giúp con người tìm được lối đi.",
    "thoanTruyen": "Quẻ Khảm tượng trưng cho hiểm trở và những thử thách lặp đi lặp lại. Giá trị của quẻ nằm ở khả năng thích nghi và không từ bỏ trước khó khăn.",
    "daiTuong": "Người quân tử lấy sự bền bỉ và thận trọng để vượt qua nghịch cảnh.",
    "haos": [
      "Sơ Lục: nhận thức rõ nguy cơ để tránh mắc sai lầm.",
      "Cửu Nhị: giữ bình tĩnh trong hoàn cảnh khó khăn.",
      "Lục Tam: hành động thiếu cân nhắc dễ làm tăng rủi ro.",
      "Lục Tứ: tìm kiếm hỗ trợ khi cần thiết.",
      "Cửu Ngũ: kiên định giúp vượt qua thử thách lớn.",
      "Thượng Lục: mất phương hướng sẽ kéo dài khó khăn.",
      "Ý nghĩa chung: nghị lực là chìa khóa để vượt hiểm."
    ]
  },
  "30": {
    "thoan": "Tri thức và sự sáng suốt giúp con người nhìn rõ con đường phía trước và đưa ra lựa chọn đúng đắn.",
    "thoanTruyen": "Quẻ Ly tượng trưng cho ánh sáng, trí tuệ và sự hiểu biết. Khi nhận thức được bản chất sự việc, con người sẽ hành động hiệu quả và phù hợp hơn.",
    "daiTuong": "Người quân tử dùng học vấn và tư duy sáng suốt để soi đường cho hành động của mình.",
    "haos": [
      "Sơ Cửu: bắt đầu bằng tinh thần học hỏi và tìm hiểu.",
      "Lục Nhị: tri thức đúng đắn mang lại sự ổn định.",
      "Cửu Tam: hiểu biết nhưng cần tránh kiêu ngạo.",
      "Cửu Tứ: mở rộng nhận thức giúp phát triển bản thân.",
      "Lục Ngũ: dùng trí tuệ để phục vụ lợi ích chung.",
      "Thượng Cửu: ánh sáng của tri thức cần đi cùng trách nhiệm.",
      "Ý nghĩa chung: trí tuệ giúp con người phát triển và trưởng thành."
    ]
  },
  "31": {
    "thoan": "Sự chân thành và thấu hiểu giúp tạo nên những kết nối sâu sắc và bền vững.",
    "thoanTruyen": "Quẻ Hàm tượng trưng cho sự cảm ứng và ảnh hưởng lẫn nhau giữa con người với con người. Khi hành động bằng sự chân thành, các mối quan hệ sẽ phát triển hài hòa hơn.",
    "daiTuong": "Người quân tử dùng sự chân thành và tôn trọng để xây dựng các mối quan hệ tốt đẹp.",
    "haos": [
      "Sơ Lục: cảm ứng bắt đầu từ những tiếp xúc ban đầu.",
      "Lục Nhị: giữ sự chân thành giúp tạo niềm tin.",
      "Cửu Tam: cảm xúc nhất thời dễ làm mất cân bằng.",
      "Cửu Tứ: biết thấu hiểu người khác tạo nên sự gắn kết.",
      "Cửu Ngũ: ảnh hưởng tích cực đến tập thể bằng đức hạnh.",
      "Thượng Lục: kết nối bền vững cần xuất phát từ nội tâm chân thật.",
      "Ý nghĩa chung: các mối quan hệ tốt đẹp được xây dựng từ sự chân thành."
    ]
  },
  "32": {
    "thoan": "Sự kiên trì và ổn định trong thời gian dài sẽ tạo nên thành quả vững chắc.",
    "thoanTruyen": "Quẻ Hằng tượng trưng cho sự bền bỉ và khả năng duy trì điều đúng đắn qua thời gian. Thành công không chỉ đến từ nỗ lực nhất thời mà còn từ sự kiên định lâu dài.",
    "daiTuong": "Người quân tử giữ vững nguyên tắc và không ngừng hoàn thiện bản thân qua từng ngày.",
    "haos": [
      "Sơ Lục: khởi đầu cần xây dựng nền tảng ổn định.",
      "Cửu Nhị: giữ vững hướng đi giúp duy trì tiến bộ.",
      "Cửu Tam: thay đổi thất thường làm giảm hiệu quả.",
      "Cửu Tứ: kiên trì đúng cách sẽ tạo kết quả bền vững.",
      "Lục Ngũ: sự ổn định đem lại niềm tin cho người khác.",
      "Thượng Lục: cố chấp mù quáng không phải là kiên định.",
      "Ý nghĩa chung: bền bỉ là một trong những chìa khóa của thành công."
    ]
  },
  "33": {
    "thoan": "Biết lùi đúng lúc không phải là thất bại mà là cách bảo toàn sức mạnh cho tương lai.",
    "thoanTruyen": "Quẻ Độn tượng trưng cho việc chủ động tránh đối đầu khi hoàn cảnh không còn thuận lợi. Sự khôn ngoan nằm ở việc nhận biết thời điểm nên tiến và khi nào nên lui.",
    "daiTuong": "Người quân tử giữ vững giá trị của mình và biết tránh những xung đột không cần thiết.",
    "haos": [
      "Sơ Lục: nhận ra dấu hiệu bất lợi từ sớm.",
      "Lục Nhị: giữ vững nguyên tắc trong khi rút lui.",
      "Cửu Tam: do dự dễ khiến tình thế khó khăn hơn.",
      "Cửu Tứ: chủ động thay đổi giúp giảm tổn thất.",
      "Cửu Ngũ: biết lui để chuẩn bị cho bước tiến mới.",
      "Thượng Cửu: rút lui đúng lúc là một dạng của trí tuệ.",
      "Ý nghĩa chung: biết thời thế giúp bảo toàn và phát triển lâu dài."
    ]
  },
  "34": {
    "thoan": "Sức mạnh chỉ phát huy giá trị khi được dẫn dắt bởi lý trí và đạo đức.",
    "thoanTruyen": "Quẻ Đại Tráng tượng trưng cho giai đoạn có nhiều năng lượng và khả năng hành động. Tuy nhiên, sức mạnh cần được sử dụng đúng cách để không trở thành sự áp đặt hoặc nóng vội.",
    "daiTuong": "Người quân tử dùng sức mạnh để bảo vệ điều đúng đắn thay vì phục vụ lợi ích cá nhân.",
    "haos": [
      "Sơ Cửu: nóng vội dễ làm giảm hiệu quả của sức mạnh.",
      "Cửu Nhị: giữ sự cân bằng khi hành động.",
      "Cửu Tam: sức mạnh thiếu kiểm soát dễ gây xung đột.",
      "Cửu Tứ: kết hợp quyết tâm với sự thận trọng.",
      "Lục Ngũ: dùng ảnh hưởng để tạo lợi ích chung.",
      "Thượng Lục: biết dừng đúng lúc giúp duy trì thành quả.",
      "Ý nghĩa chung: sức mạnh cần đi cùng trách nhiệm."
    ]
  },
  "35": {
    "thoan": "Sự tiến bộ bền vững đến từ năng lực thực chất và thái độ tích cực.",
    "thoanTruyen": "Quẻ Tấn tượng trưng cho quá trình phát triển và mở rộng ảnh hưởng. Khi có đủ năng lực và giữ được phẩm chất tốt đẹp, cơ hội thăng tiến sẽ xuất hiện.",
    "daiTuong": "Người quân tử không ngừng học hỏi và hoàn thiện bản thân để từng bước tiến lên.",
    "haos": [
      "Sơ Lục: tiến bộ bắt đầu từ những bước nhỏ.",
      "Lục Nhị: kiên trì giúp vượt qua trở ngại ban đầu.",
      "Lục Tam: hợp tác tốt tạo điều kiện phát triển nhanh hơn.",
      "Cửu Tứ: tránh để thành công làm sinh kiêu ngạo.",
      "Lục Ngũ: sử dụng vị thế để tạo giá trị cho nhiều người.",
      "Thượng Cửu: phát triển cần đi kèm sự tự nhìn lại.",
      "Ý nghĩa chung: tiến bộ thực sự đến từ năng lực và đức hạnh."
    ]
  },
  "36": {
    "thoan": "Khi hoàn cảnh không thuận lợi, cần giữ vững nội lực và chờ thời cơ thích hợp để phát huy khả năng.",
    "thoanTruyen": "Quẻ Minh Di tượng trưng cho giai đoạn tài năng hoặc giá trị đúng đắn chưa được nhìn nhận. Đây là lúc cần bảo vệ điều tốt đẹp bên trong thay vì đối đầu trực diện.",
    "daiTuong": "Người quân tử giữ vững đạo đức và lý tưởng ngay cả khi gặp nghịch cảnh.",
    "haos": [
      "Sơ Cửu: nhận ra khó khăn từ sớm giúp tránh tổn thất lớn.",
      "Lục Nhị: giữ sự ngay thẳng trong hoàn cảnh bất lợi.",
      "Cửu Tam: biết tiến lui linh hoạt để bảo vệ mục tiêu.",
      "Lục Tứ: hiểu rõ hoàn cảnh để lựa chọn cách ứng xử phù hợp.",
      "Lục Ngũ: kiên trì giữ điều đúng đắn dù không được công nhận ngay.",
      "Thượng Lục: sau giai đoạn khó khăn sẽ xuất hiện cơ hội mới.",
      "Ý nghĩa chung: bảo vệ giá trị cốt lõi trong thời kỳ thử thách."
    ]
  },
  "37": {
    "thoan": "Một tập thể bền vững được xây dựng từ trách nhiệm, sự tôn trọng và vai trò rõ ràng của từng thành viên.",
    "thoanTruyen": "Quẻ Gia Nhân tượng trưng cho việc xây dựng trật tự và hòa khí trong gia đình hoặc tổ chức. Khi mỗi người hoàn thành tốt trách nhiệm của mình, tập thể sẽ phát triển ổn định.",
    "daiTuong": "Người quân tử lấy sự chân thành và trách nhiệm để vun đắp các mối quan hệ lâu dài.",
    "haos": [
      "Sơ Cửu: xây dựng nền nếp tốt ngay từ đầu.",
      "Lục Nhị: sự chăm sóc chân thành tạo nên gắn kết.",
      "Cửu Tam: kỷ luật cần đi cùng sự thấu hiểu.",
      "Lục Tứ: biết quan tâm giúp duy trì hòa hợp.",
      "Cửu Ngũ: lãnh đạo bằng đức hạnh tạo sự tín nhiệm.",
      "Thượng Cửu: giữ trọn trách nhiệm giúp tập thể phát triển bền vững.",
      "Ý nghĩa chung: trách nhiệm là nền tảng của sự gắn kết lâu dài."
    ]
  },
  "38": {
    "thoan": "Sự khác biệt không nhất thiết dẫn đến xung đột nếu biết tôn trọng và thấu hiểu lẫn nhau.",
    "thoanTruyen": "Quẻ Khuê tượng trưng cho những khác biệt trong suy nghĩ hoặc mục tiêu. Thành công đến từ khả năng tìm điểm chung và hợp tác dù không hoàn toàn giống nhau.",
    "daiTuong": "Người quân tử tôn trọng sự đa dạng và luôn tìm cách kết nối thay vì chia rẽ.",
    "haos": [
      "Sơ Cửu: khác biệt nhỏ không nên trở thành mâu thuẫn lớn.",
      "Cửu Nhị: đối thoại giúp tăng sự thấu hiểu.",
      "Lục Tam: cố chấp dễ tạo khoảng cách với người khác.",
      "Cửu Tứ: chủ động hòa giải giúp cải thiện quan hệ.",
      "Lục Ngũ: tôn trọng khác biệt tạo nên hợp tác lâu dài.",
      "Thượng Cửu: nhìn nhận vấn đề từ nhiều góc độ giúp hóa giải xung đột.",
      "Ý nghĩa chung: khác biệt có thể trở thành động lực phát triển."
    ]
  },
  "39": {
    "thoan": "Khi gặp khó khăn, điều quan trọng là giữ vững tinh thần và tìm hướng đi phù hợp thay vì cố gắng tiến bằng mọi giá.",
    "thoanTruyen": "Quẻ Kiển tượng trưng cho những trở ngại trên con đường phát triển. Sự khôn ngoan nằm ở việc nhận diện khó khăn đúng cách và tìm giải pháp thích hợp.",
    "daiTuong": "Người quân tử dùng sự kiên trì và tự nhìn lại để vượt qua thử thách.",
    "haos": [
      "Sơ Lục: nhận biết trở ngại từ sớm giúp hạn chế rủi ro.",
      "Lục Nhị: tìm kiếm sự hỗ trợ khi cần thiết.",
      "Cửu Tam: hành động đơn độc dễ làm tăng khó khăn.",
      "Lục Tứ: linh hoạt giúp tìm ra lối đi mới.",
      "Cửu Ngũ: giữ vững mục tiêu trong khi điều chỉnh phương pháp.",
      "Thượng Lục: vượt khó thành công nhờ kinh nghiệm tích lũy.",
      "Ý nghĩa chung: thử thách là cơ hội để trưởng thành."
    ]
  },
  "40": {
    "thoan": "Sau khi vượt qua khó khăn, cần tháo gỡ căng thẳng và mở đường cho sự phát triển mới.",
    "thoanTruyen": "Quẻ Giải tượng trưng cho sự hóa giải những trở ngại và áp lực đã tích tụ trước đó. Đây là thời điểm thích hợp để khôi phục cân bằng và bắt đầu một giai đoạn tích cực hơn.",
    "daiTuong": "Người quân tử chủ động giải quyết vấn đề và tạo điều kiện để mọi việc vận hành thuận lợi trở lại.",
    "haos": [
      "Sơ Lục: bắt đầu tháo gỡ từng vấn đề nhỏ.",
      "Cửu Nhị: hành động đúng lúc giúp giảm khó khăn nhanh chóng.",
      "Lục Tam: chậm trễ có thể làm mất cơ hội hóa giải.",
      "Cửu Tứ: chủ động đối diện vấn đề thay vì né tránh.",
      "Lục Ngũ: sự bao dung giúp xoa dịu mâu thuẫn.",
      "Thượng Lục: hoàn thành quá trình giải quyết và mở ra giai đoạn mới.",
      "Ý nghĩa chung: giải quyết tận gốc giúp tạo nền tảng phát triển lâu dài."
    ]
  },
  "41": {
    "thoan": "Biết giảm bớt điều không cần thiết sẽ tạo điều kiện cho những giá trị quan trọng phát triển.",
    "thoanTruyen": "Quẻ Tổn tượng trưng cho sự tiết giảm và hy sinh đúng lúc. Khi biết từ bỏ lợi ích nhỏ để hướng tới mục tiêu lớn hơn, con người sẽ đạt được kết quả bền vững.",
    "daiTuong": "Người quân tử dùng sự tiết chế và tự hoàn thiện để nâng cao giá trị của bản thân.",
    "haos": [
      "Sơ Cửu: sẵn sàng chia sẻ khi có thể giúp đỡ người khác.",
      "Cửu Nhị: giảm bớt nhưng vẫn giữ được nguyên tắc.",
      "Lục Tam: biết buông bỏ điều không cần thiết.",
      "Lục Tứ: thay đổi bản thân giúp cải thiện hoàn cảnh.",
      "Lục Ngũ: sự chân thành làm tăng giá trị của hy sinh.",
      "Thượng Cửu: cho đi đúng cách mang lại lợi ích lâu dài.",
      "Ý nghĩa chung: biết giảm bớt để tạo nên điều tốt đẹp hơn."
    ]
  },
  "42": {
    "thoan": "Khi biết tạo giá trị cho người khác, lợi ích chung và lợi ích cá nhân đều có cơ hội phát triển.",
    "thoanTruyen": "Quẻ Ích tượng trưng cho sự gia tăng và phát triển. Những hành động mang lại lợi ích cho cộng đồng thường tạo nên kết quả tích cực và lâu dài.",
    "daiTuong": "Người quân tử chủ động giúp đỡ người khác và không ngừng hoàn thiện bản thân.",
    "haos": [
      "Sơ Cửu: hành động thiện chí tạo khởi đầu tích cực.",
      "Lục Nhị: giúp đỡ đúng cách tạo ảnh hưởng lâu dài.",
      "Lục Tam: phát triển cần đi kèm trách nhiệm.",
      "Lục Tứ: hợp tác giúp tăng hiệu quả công việc.",
      "Cửu Ngũ: dùng vị trí của mình để tạo lợi ích chung.",
      "Thượng Cửu: chỉ nhận mà không cho đi sẽ khó bền vững.",
      "Ý nghĩa chung: muốn nhận được giá trị hãy tạo ra giá trị trước."
    ]
  },
  "43": {
    "thoan": "Khi điều đúng đã rõ ràng, cần có sự quyết đoán để hành động và loại bỏ những cản trở kéo dài.",
    "thoanTruyen": "Quẻ Quải tượng trưng cho thời điểm cần đưa ra quyết định quan trọng. Sự dứt khoát giúp giải quyết những vấn đề tồn đọng và mở đường cho sự phát triển tiếp theo.",
    "daiTuong": "Người quân tử kiên định với điều đúng và hành động minh bạch, công khai.",
    "haos": [
      "Sơ Cửu: quyết tâm cần đi cùng sự chuẩn bị.",
      "Cửu Nhị: giữ bình tĩnh trước khi hành động.",
      "Cửu Tam: nóng vội dễ dẫn đến sai lầm.",
      "Cửu Tứ: kiên trì theo đuổi mục tiêu đúng đắn.",
      "Cửu Ngũ: quyết định dựa trên nguyên tắc và trách nhiệm.",
      "Thượng Lục: cực đoan có thể làm mất đi thành quả đạt được.",
      "Ý nghĩa chung: quyết đoán hiệu quả phải dựa trên sự sáng suốt."
    ]
  },
  "44": {
    "thoan": "Mỗi cuộc gặp gỡ đều mang đến cơ hội và thử thách, vì vậy cần tỉnh táo trong lựa chọn và kết nối.",
    "thoanTruyen": "Quẻ Cấu tượng trưng cho sự gặp gỡ bất ngờ giữa những yếu tố khác nhau. Điều quan trọng là nhận biết giá trị thực sự của cơ hội trước khi đưa ra quyết định.",
    "daiTuong": "Người quân tử giữ sự tỉnh táo và nguyên tắc trong các mối quan hệ mới.",
    "haos": [
      "Sơ Lục: tiếp cận cơ hội mới bằng sự thận trọng.",
      "Cửu Nhị: giữ đúng nguyên tắc khi hợp tác với người khác.",
      "Cửu Tam: hấp tấp dễ dẫn đến lựa chọn sai lầm.",
      "Cửu Tứ: cân nhắc kỹ trước khi cam kết lâu dài.",
      "Cửu Ngũ: dùng trí tuệ để nhận diện cơ hội thực sự.",
      "Thượng Cửu: giữ khoảng cách phù hợp giúp tránh rủi ro.",
      "Ý nghĩa chung: không phải mọi cơ hội xuất hiện đều nên nắm bắt."
    ]
  },
  "45": {
    "thoan": "Những người có cùng mục tiêu và giá trị khi tập hợp lại sẽ tạo nên sức mạnh lớn.",
    "thoanTruyen": "Quẻ Tụy tượng trưng cho sự hội tụ nguồn lực và con người. Thành công đến khi tập thể biết thống nhất mục tiêu và phối hợp hiệu quả với nhau.",
    "daiTuong": "Người quân tử biết quy tụ nhân tâm và xây dựng tinh thần đoàn kết vì lợi ích chung.",
    "haos": [
      "Sơ Lục: bắt đầu kết nối bằng sự chân thành.",
      "Lục Nhị: niềm tin là nền tảng của sự hợp tác.",
      "Lục Tam: thiếu đồng lòng dễ làm giảm hiệu quả tập thể.",
      "Cửu Tứ: chủ động gắn kết giúp tăng sức mạnh chung.",
      "Cửu Ngũ: lãnh đạo bằng uy tín và trách nhiệm.",
      "Thượng Lục: duy trì đoàn kết cần sự nỗ lực lâu dài.",
      "Ý nghĩa chung: sức mạnh tập thể đến từ sự đồng lòng."
    ]
  },
  "46": {
    "thoan": "Sự tiến bộ bền vững được xây dựng từ nỗ lực liên tục và từng bước vươn lên.",
    "thoanTruyen": "Quẻ Thăng tượng trưng cho quá trình phát triển từng bước và tích lũy thành quả theo thời gian. Thành công đến với những người biết kiên trì và giữ vững hướng đi đúng đắn.",
    "daiTuong": "Người quân tử không ngừng học hỏi và rèn luyện để từng bước nâng cao năng lực của mình.",
    "haos": [
      "Sơ Lục: bắt đầu từ những việc nhỏ nhưng đúng hướng.",
      "Cửu Nhị: sự chân thành giúp nhận được sự hỗ trợ.",
      "Cửu Tam: cơ hội phát triển xuất hiện khi đã chuẩn bị đầy đủ.",
      "Lục Tứ: tiến lên bằng sự ổn định và thận trọng.",
      "Lục Ngũ: giữ được khiêm tốn trong lúc thành công.",
      "Thượng Lục: tiếp tục hoàn thiện bản thân để tiến xa hơn.",
      "Ý nghĩa chung: thành công là kết quả của quá trình nỗ lực bền bỉ."
    ]
  },
  "47": {
    "thoan": "Trong nghịch cảnh, điều quan trọng nhất là giữ vững ý chí và niềm tin vào giá trị của mình.",
    "thoanTruyen": "Quẻ Khốn tượng trưng cho hoàn cảnh thiếu thốn hoặc bị giới hạn. Đây là lúc cần phát huy nội lực và khả năng thích nghi để vượt qua thử thách.",
    "daiTuong": "Người quân tử giữ phẩm chất tốt đẹp ngay cả khi gặp hoàn cảnh khó khăn.",
    "haos": [
      "Sơ Lục: khó khăn ban đầu là cơ hội để rèn luyện.",
      "Cửu Nhị: giữ vững tinh thần giúp giảm bớt áp lực.",
      "Lục Tam: bi quan khiến tình hình trở nên nặng nề hơn.",
      "Cửu Tứ: biết tìm kiếm sự hỗ trợ đúng lúc.",
      "Cửu Ngũ: nghị lực giúp vượt qua thử thách lớn.",
      "Thượng Lục: sau khó khăn sẽ xuất hiện cơ hội mới.",
      "Ý nghĩa chung: nghịch cảnh có thể trở thành động lực trưởng thành."
    ]
  },
  "48": {
    "thoan": "Những giá trị bền vững cần được duy trì và chăm sóc để tiếp tục mang lại lợi ích lâu dài.",
    "thoanTruyen": "Quẻ Tỉnh tượng trưng cho nguồn lực chung và những giá trị phục vụ cộng đồng. Điều quan trọng không phải là tạo ra cái mới liên tục mà là biết giữ gìn và phát huy điều tốt đẹp đang có.",
    "daiTuong": "Người quân tử chăm lo những nền tảng thiết yếu để tạo lợi ích lâu dài cho mọi người.",
    "haos": [
      "Sơ Lục: nguồn lực bị bỏ quên sẽ dần mất giá trị.",
      "Cửu Nhị: biết khai thác đúng cách sẽ tạo lợi ích thiết thực.",
      "Cửu Tam: năng lực có sẵn cần được phát huy hiệu quả.",
      "Lục Tứ: chăm sóc và bảo trì giúp duy trì giá trị lâu dài.",
      "Cửu Ngũ: sử dụng nguồn lực vì lợi ích chung.",
      "Thượng Lục: giá trị lớn nhất nằm ở sự chia sẻ và phục vụ.",
      "Ý nghĩa chung: gìn giữ nền tảng là đầu tư cho tương lai."
    ]
  },
  "49": {
    "thoan": "Khi hoàn cảnh thay đổi, cần dũng cảm đổi mới để thích nghi và phát triển.",
    "thoanTruyen": "Quẻ Cách tượng trưng cho những thay đổi cần thiết để tạo ra sự tiến bộ. Cải cách thành công đòi hỏi chuẩn bị kỹ lưỡng và sự đồng thuận phù hợp.",
    "daiTuong": "Người quân tử biết thay đổi điều chưa phù hợp nhưng vẫn giữ vững những giá trị cốt lõi.",
    "haos": [
      "Sơ Cửu: chưa nên thay đổi khi điều kiện chưa chín muồi.",
      "Lục Nhị: chuẩn bị kỹ trước khi hành động.",
      "Cửu Tam: cải cách cần kiên định nhưng không cực đoan.",
      "Cửu Tứ: thay đổi đúng lúc giúp tạo chuyển biến tích cực.",
      "Cửu Ngũ: đổi mới dựa trên sự sáng suốt và trách nhiệm.",
      "Thượng Lục: sau thay đổi cần ổn định lại hệ thống.",
      "Ý nghĩa chung: đổi mới hiệu quả phải dựa trên nền tảng vững chắc."
    ]
  },
  "50": {
    "thoan": "Khi nền tảng đã được xây dựng vững chắc, con người có thể tạo ra những giá trị lớn lao và bền vững.",
    "thoanTruyen": "Quẻ Đỉnh tượng trưng cho sự hoàn thiện và nâng cao chất lượng của sự vật. Đây là giai đoạn chuyển hóa nội lực thành thành quả có giá trị cho cộng đồng.",
    "daiTuong": "Người quân tử không ngừng hoàn thiện bản thân để tạo nên những giá trị hữu ích cho xã hội.",
    "haos": [
      "Sơ Lục: bắt đầu cải thiện từ nền tảng cơ bản nhất.",
      "Cửu Nhị: năng lực được phát huy đúng lúc sẽ tạo thành quả tốt.",
      "Cửu Tam: sự thay đổi tích cực cần thời gian để hoàn thiện.",
      "Cửu Tứ: thiếu chuẩn bị có thể làm giảm hiệu quả thành quả đạt được.",
      "Lục Ngũ: trí tuệ và đức độ giúp nâng cao giá trị công việc.",
      "Thượng Cửu: thành tựu lớn cần được sử dụng đúng mục đích.",
      "Ý nghĩa chung: giá trị bền vững đến từ quá trình hoàn thiện liên tục."
    ]
  },
  "51": {
    "thoan": "Những biến động bất ngờ có thể trở thành cơ hội để thức tỉnh và trưởng thành.",
    "thoanTruyen": "Quẻ Chấn tượng trưng cho sự chuyển động mạnh mẽ và những thay đổi đột ngột. Khi giữ được bình tĩnh trước biến động, con người sẽ tìm thấy hướng đi đúng đắn.",
    "daiTuong": "Người quân tử dùng sự tỉnh táo để đối mặt và thích nghi với những thay đổi của hoàn cảnh.",
    "haos": [
      "Sơ Cửu: biến động ban đầu giúp nhận ra điều cần thay đổi.",
      "Lục Nhị: giữ bình tĩnh trước áp lực và bất ngờ.",
      "Lục Tam: hoảng loạn dễ dẫn đến những quyết định sai lầm.",
      "Cửu Tứ: thích nghi nhanh giúp vượt qua thử thách.",
      "Lục Ngũ: giữ vững vị trí dù hoàn cảnh biến động.",
      "Thượng Lục: sau biến động là cơ hội phát triển mới.",
      "Ý nghĩa chung: bình tĩnh trước thay đổi sẽ tạo ra sức mạnh."
    ]
  },
  "52": {
    "thoan": "Biết dừng đúng lúc là biểu hiện của sự sáng suốt và tự chủ.",
    "thoanTruyen": "Quẻ Cấn tượng trưng cho sự tĩnh lặng và khả năng kiểm soát bản thân. Không phải lúc nào tiến lên cũng là lựa chọn tốt nhất, đôi khi dừng lại để suy ngẫm mới là điều cần thiết.",
    "daiTuong": "Người quân tử giữ sự điềm tĩnh và biết tự nhìn lại để điều chỉnh hành động.",
    "haos": [
      "Sơ Lục: dừng lại trước khi mắc sai lầm lớn.",
      "Lục Nhị: biết giới hạn của bản thân.",
      "Cửu Tam: cố chấp tiến lên dễ gặp trở ngại.",
      "Lục Tứ: giữ tâm bình ổn giữa nhiều áp lực.",
      "Lục Ngũ: sự điềm tĩnh tạo nên quyết định sáng suốt.",
      "Thượng Cửu: dừng đúng lúc giúp bảo toàn thành quả.",
      "Ý nghĩa chung: tự chủ là nền tảng của trí tuệ."
    ]
  },
  "53": {
    "thoan": "Những thành quả vững chắc được xây dựng bằng sự tiến bộ từng bước và kiên trì lâu dài.",
    "thoanTruyen": "Quẻ Tiệm tượng trưng cho quá trình phát triển chậm nhưng ổn định. Sự tăng trưởng bền vững thường đến từ những thay đổi nhỏ được duy trì trong thời gian dài.",
    "daiTuong": "Người quân tử tập trung vào tiến bộ từng bước thay vì tìm kiếm thành công tức thời.",
    "haos": [
      "Sơ Lục: khởi đầu nhỏ vẫn có giá trị nếu đúng hướng.",
      "Lục Nhị: kiên trì giúp tạo nền tảng vững chắc.",
      "Cửu Tam: nóng vội dễ làm gián đoạn tiến trình phát triển.",
      "Lục Tứ: tiến bộ ổn định tạo niềm tin cho người khác.",
      "Cửu Ngũ: thành công đến từ sự tích lũy lâu dài.",
      "Thượng Cửu: thành quả lớn là kết quả của nhiều bước nhỏ.",
      "Ý nghĩa chung: tiến chậm nhưng chắc thường bền vững hơn."
    ]
  },
  "54": {
    "thoan": "Mỗi giai đoạn mới đều đòi hỏi sự thích nghi và hiểu rõ trách nhiệm của mình.",
    "thoanTruyen": "Quẻ Quy Muội tượng trưng cho sự chuyển đổi vai trò hoặc bước vào hoàn cảnh mới. Thành công phụ thuộc vào khả năng thích nghi và hành động phù hợp với thực tế.",
    "daiTuong": "Người quân tử nhìn nhận đúng vị trí của mình và ứng xử phù hợp với từng hoàn cảnh.",
    "haos": [
      "Sơ Cửu: chấp nhận những thay đổi mới bằng thái độ tích cực.",
      "Cửu Nhị: giữ sự chân thành khi xây dựng các mối quan hệ.",
      "Lục Tam: thiếu chuẩn bị dễ dẫn đến lúng túng.",
      "Cửu Tứ: thích nghi giúp giảm bớt khó khăn ban đầu.",
      "Lục Ngũ: hiểu trách nhiệm của bản thân trong vai trò mới.",
      "Thượng Lục: trưởng thành đến từ kinh nghiệm thực tế.",
      "Ý nghĩa chung: thay đổi là cơ hội để phát triển."
    ]
  },
  "55": {
    "thoan": "Thời kỳ phát triển mạnh mẽ cần đi cùng sự tỉnh táo để duy trì thành quả lâu dài.",
    "thoanTruyen": "Quẻ Phong tượng trưng cho giai đoạn hưng thịnh và đạt được nhiều thành tựu. Khi ở đỉnh cao, điều quan trọng là giữ sự sáng suốt và tránh tự mãn.",
    "daiTuong": "Người quân tử sử dụng thành công để tạo giá trị cho cộng đồng và chuẩn bị cho những thay đổi trong tương lai.",
    "haos": [
      "Sơ Cửu: cơ hội phát triển xuất hiện rõ ràng.",
      "Lục Nhị: giữ sự cân bằng giữa thành công và khiêm tốn.",
      "Cửu Tam: ánh hào quang không nên che mờ thực tế.",
      "Cửu Tứ: tiếp tục hoàn thiện dù đã đạt thành tựu.",
      "Lục Ngũ: dùng ảnh hưởng của mình để tạo lợi ích chung.",
      "Thượng Lục: tự mãn có thể dẫn đến suy giảm.",
      "Ý nghĩa chung: duy trì thành công khó hơn đạt được thành công."
    ]
  },
  "56": {
    "thoan": "Khi ở trong môi trường mới, sự khiêm tốn và khả năng thích nghi sẽ giúp vượt qua nhiều khó khăn.",
    "thoanTruyen": "Quẻ Lữ tượng trưng cho hành trình xa nhà hoặc những giai đoạn phải rời khỏi vùng an toàn. Thành công đến từ khả năng thích nghi và giữ đúng giá trị của bản thân trong hoàn cảnh mới.",
    "daiTuong": "Người quân tử cư xử đúng mực ở bất kỳ nơi đâu và luôn giữ sự thận trọng khi đối mặt với điều chưa quen thuộc.",
    "haos": [
      "Sơ Lục: bước vào môi trường mới cần quan sát và học hỏi.",
      "Lục Nhị: sự chân thành giúp tạo được thiện cảm.",
      "Cửu Tam: kiêu ngạo dễ dẫn đến những rắc rối không cần thiết.",
      "Cửu Tứ: giữ vững nguyên tắc trong hoàn cảnh thay đổi.",
      "Lục Ngũ: ứng xử đúng mực giúp nhận được sự hỗ trợ.",
      "Thượng Cửu: mất phương hướng sẽ làm giảm cơ hội phát triển.",
      "Ý nghĩa chung: thích nghi tốt giúp biến thay đổi thành cơ hội."
    ]
  },
  "57": {
    "thoan": "Sự mềm dẻo và linh hoạt thường mang lại hiệu quả lâu dài hơn đối đầu trực diện.",
    "thoanTruyen": "Quẻ Tốn tượng trưng cho ảnh hưởng âm thầm nhưng bền bỉ, giống như gió lan tỏa khắp nơi. Sức mạnh của quẻ nằm ở khả năng thuyết phục và thích nghi.",
    "daiTuong": "Người quân tử dùng sự khiêm nhường và linh hoạt để đạt được mục tiêu.",
    "haos": [
      "Sơ Lục: bắt đầu bằng thái độ cởi mở và cầu thị.",
      "Cửu Nhị: kiên trì trong phương pháp đúng đắn.",
      "Cửu Tam: thiếu quyết đoán dễ làm lỡ cơ hội.",
      "Lục Tứ: mềm dẻo giúp hóa giải trở ngại.",
      "Cửu Ngũ: dùng ảnh hưởng tích cực để dẫn dắt người khác.",
      "Thượng Cửu: quá do dự có thể làm mất hiệu quả hành động.",
      "Ý nghĩa chung: linh hoạt là một dạng sức mạnh."
    ]
  },
  "58": {
    "thoan": "Niềm vui chân chính đến từ sự hài hòa, chân thành và khả năng kết nối với người khác.",
    "thoanTruyen": "Quẻ Đoài tượng trưng cho niềm vui, sự cởi mở và giao tiếp tích cực. Khi con người chia sẻ những giá trị tốt đẹp, môi trường xung quanh cũng trở nên hài hòa hơn.",
    "daiTuong": "Người quân tử dùng sự chân thành và thái độ tích cực để xây dựng các mối quan hệ tốt đẹp.",
    "haos": [
      "Sơ Cửu: niềm vui giản dị mang lại sự nhẹ nhàng.",
      "Cửu Nhị: chân thành giúp tạo được sự tin tưởng.",
      "Lục Tam: chạy theo niềm vui nhất thời dễ gây thất vọng.",
      "Cửu Tứ: chia sẻ tích cực giúp tăng sự gắn kết.",
      "Cửu Ngũ: niềm vui đi cùng trách nhiệm sẽ bền vững hơn.",
      "Thượng Lục: quá phụ thuộc vào sự công nhận từ bên ngoài dễ gây mất cân bằng.",
      "Ý nghĩa chung: niềm vui chân thật bắt nguồn từ sự hài hòa nội tâm."
    ]
  },
  "59": {
    "thoan": "Những trở ngại trong lòng người cần được tháo gỡ để tạo nên sự kết nối và đồng thuận mới.",
    "thoanTruyen": "Quẻ Hoán tượng trưng cho quá trình giải tỏa những khoảng cách, hiểu lầm hoặc sự trì trệ. Sau khi được khai thông, năng lượng tích cực sẽ lưu chuyển trở lại.",
    "daiTuong": "Người quân tử chủ động kết nối và hóa giải những điều gây chia cách giữa mọi người.",
    "haos": [
      "Sơ Lục: bắt đầu tháo gỡ những vướng mắc nhỏ.",
      "Cửu Nhị: chân thành giúp giảm bớt khoảng cách.",
      "Lục Tam: cố chấp dễ làm mâu thuẫn kéo dài.",
      "Lục Tứ: chủ động hòa giải tạo kết quả tích cực.",
      "Cửu Ngũ: quy tụ mọi người bằng mục tiêu chung.",
      "Thượng Cửu: giải quyết tận gốc giúp ổn định lâu dài.",
      "Ý nghĩa chung: khai thông là bước đầu của phát triển."
    ]
  },
  "60": {
    "thoan": "Biết giới hạn và điều tiết hợp lý giúp duy trì sự cân bằng và phát triển bền vững.",
    "thoanTruyen": "Quẻ Tiết tượng trưng cho nguyên tắc, giới hạn và sự điều độ. Tự do chỉ thực sự có giá trị khi đi cùng trách nhiệm và khả năng tự kiểm soát.",
    "daiTuong": "Người quân tử xây dựng nguyên tắc rõ ràng để giữ cân bằng trong cuộc sống và công việc.",
    "haos": [
      "Sơ Cửu: rèn luyện tính kỷ luật từ những việc nhỏ.",
      "Cửu Nhị: biết giới hạn giúp tránh sai lầm.",
      "Lục Tam: buông thả dễ gây mất cân bằng.",
      "Lục Tứ: áp dụng nguyên tắc một cách linh hoạt.",
      "Cửu Ngũ: điều độ giúp duy trì sự ổn định lâu dài.",
      "Thượng Lục: quá khắt khe cũng có thể tạo áp lực không cần thiết.",
      "Ý nghĩa chung: cân bằng là nền tảng của phát triển bền vững."
    ]
  },
  "61": {
    "thoan": "Sự chân thành tạo nên lòng tin và là nền tảng cho mọi mối quan hệ bền vững.",
    "thoanTruyen": "Quẻ Trung Phu tượng trưng cho sự thành thật xuất phát từ nội tâm. Khi lời nói và hành động thống nhất với nhau, con người dễ nhận được sự tín nhiệm và hợp tác từ người khác.",
    "daiTuong": "Người quân tử lấy đức thành tín làm nền tảng để xây dựng các mối quan hệ và hoàn thành công việc.",
    "haos": [
      "Sơ Cửu: lòng tin được xây dựng từ những hành động nhỏ.",
      "Cửu Nhị: chân thành giúp tạo nên sự đồng cảm.",
      "Lục Tam: dao động dễ làm suy giảm niềm tin.",
      "Lục Tứ: giữ sự trung thực trong mọi hoàn cảnh.",
      "Cửu Ngũ: thành tín giúp quy tụ và dẫn dắt người khác.",
      "Thượng Cửu: lời nói cần đi đôi với hành động.",
      "Ý nghĩa chung: lòng tin là tài sản quý giá cần được gìn giữ."
    ]
  },
  "62": {
    "thoan": "Trong những việc nhỏ có thể linh hoạt, nhưng những quyết định lớn cần được cân nhắc kỹ lưỡng.",
    "thoanTruyen": "Quẻ Tiểu Quá tượng trưng cho thời kỳ thích hợp với những điều chỉnh vừa phải hơn là các thay đổi lớn. Sự cẩn trọng giúp hạn chế sai lầm và duy trì ổn định.",
    "daiTuong": "Người quân tử chú ý đến những chi tiết nhỏ và luôn hành động trong khả năng của mình.",
    "haos": [
      "Sơ Lục: tránh hấp tấp trong những việc mới bắt đầu.",
      "Lục Nhị: biết giới hạn giúp duy trì sự ổn định.",
      "Cửu Tam: tham vọng quá mức dễ dẫn đến sai lầm.",
      "Cửu Tứ: điều chỉnh từng bước tạo hiệu quả tốt hơn.",
      "Lục Ngũ: tập trung vào những việc thiết thực.",
      "Thượng Lục: vượt quá giới hạn sẽ tạo rủi ro không cần thiết.",
      "Ý nghĩa chung: những bước nhỏ đúng hướng tạo nên kết quả lớn."
    ]
  },
  "63": {
    "thoan": "Sau khi đạt được thành công, cần tiếp tục duy trì và hoàn thiện để giữ vững thành quả.",
    "thoanTruyen": "Quẻ Ký Tế tượng trưng cho trạng thái hoàn thành và cân bằng. Tuy nhiên, mọi thành công đều cần được duy trì bằng sự tỉnh táo và tinh thần không ngừng cải tiến.",
    "daiTuong": "Người quân tử chuẩn bị cho những thay đổi tiếp theo ngay cả khi mọi việc đang thuận lợi.",
    "haos": [
      "Sơ Cửu: khởi đầu thuận lợi nhưng không nên chủ quan.",
      "Lục Nhị: giữ cân bằng giúp duy trì thành quả.",
      "Cửu Tam: thành công cần được củng cố bằng hành động thực tế.",
      "Lục Tứ: chú ý những dấu hiệu suy giảm nhỏ.",
      "Cửu Ngũ: tiếp tục hoàn thiện dù đã đạt kết quả tốt.",
      "Thượng Lục: tự mãn có thể làm mất những gì đã đạt được.",
      "Ý nghĩa chung: duy trì thành công đòi hỏi sự tỉnh táo lâu dài."
    ]
  },
  "64": {
    "thoan": "Khi công việc còn dang dở, điều quan trọng là giữ vững quyết tâm và hoàn thiện từng bước cuối cùng.",
    "thoanTruyen": "Quẻ Vị Tế tượng trưng cho giai đoạn chuyển tiếp trước khi đạt được mục tiêu. Đây là lúc cần kiên nhẫn, tập trung và tránh chủ quan trước thành công đang đến gần.",
    "daiTuong": "Người quân tử luôn duy trì tinh thần học hỏi và hoàn thiện, bởi hành trình phát triển không bao giờ thực sự kết thúc.",
    "haos": [
      "Sơ Lục: khởi đầu còn nhiều bỡ ngỡ và thiếu ổn định.",
      "Cửu Nhị: giữ được định hướng sẽ tiến gần mục tiêu hơn.",
      "Lục Tam: nóng vội dễ làm hỏng công việc đang dang dở.",
      "Cửu Tứ: kiên trì giúp vượt qua giai đoạn khó khăn cuối cùng.",
      "Lục Ngũ: sự chân thành và trách nhiệm mang lại kết quả tốt.",
      "Thượng Cửu: hoàn thành một mục tiêu là khởi đầu của hành trình mới.",
      "Ý nghĩa chung: quá trình phát triển luôn tiếp diễn và không có điểm kết thúc tuyệt đối."
    ]
  }
};
