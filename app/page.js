// app/page.js
import { connect } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getApprovedArticles() {
  const connection = await connect();

  const [rows] = await connection.execute(`
    SELECT a.article_id, a.article_title, a.article_type, a.article_date,
           a.article_link, u.user_name AS owner_name , n.n_dare
    FROM article a
    JOIN user_article ua ON a.article_id = ua.article
    JOIN user u ON ua.user_id = u.user_id
    JOIN notification n ON a.article_id = n.n_id
    WHERE a.article__status = 'Approved'
    ORDER BY n.n_dare DESC
  `);

  await connection.end();
  return rows;
}

export default async function Page() {
  const articles = await getApprovedArticles();

  // สถิติเจ้าของ
  let ownerStats = Array.from(
    articles.reduce((map, a) => {
      map.set(a.owner_name, (map.get(a.owner_name) || 0) + 1);
      return map;
    }, new Map())
  );

  // เรียงจากมากไปน้อย และจำกัดแค่ 3 คน
  ownerStats = ownerStats.sort((a, b) => b[1] - a[1]).slice(0, 3);

  // สถิติประเภท
  const typeStats = Array.from(
    articles.reduce((map, a) => {
      map.set(a.article_type, (map.get(a.article_type) || 0) + 1);
      return map;
    }, new Map())
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-blue-50 p-8 rounded-lg shadow text-center">
        <h1 className="text-4xl font-bold mb-2">ยินดีต้อนรับสู่ระบบ Publication</h1>
        <p className="text-lg text-gray-700">นี่คือสถิติและรายการบทความที่ได้รับการอนุมัติแล้ว</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow border">
          <h2 className="text-xl font-semibold mb-4">จำนวนบทความตามเจ้าของ</h2>
          <ul className="list-disc pl-6 space-y-1">
            {ownerStats.map(([owner, count]) => (
              <li key={owner}>
                {owner}: {count} บทความ
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded shadow border">
          <h2 className="text-xl font-semibold mb-4">จำนวนบทความตามประเภท</h2>
          <ul className="list-disc pl-6 space-y-1">
            {typeStats.map(([type, count]) => (
              <li key={type}>
                {type}: {count} บทความ
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded shadow border">
          <h2 className="text-xl font-semibold mb-4">จำนวนบทความที่อนุมัติแล้ว</h2>
          <p className="text-gray-700 text-lg">{articles.length} บทความ</p>
        </div>
      </div>

      {/* รายการบทความ */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">รายการล่าสุด</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.slice(0, 6).map(a => (
            <div key={a.article_id} className="p-4 bg-white rounded shadow border overflow-hidden">
              <h3 className="font-bold text-lg mb-1 line-clamp-2">{a.article_title}</h3>
              <p className="text-sm line-clamp-1">ประเภท: {a.article_type}</p>
              <p className="text-sm line-clamp-1">เจ้าของ: {a.owner_name}</p>
              <p className="text-sm line-clamp-1">วันที่: {new Date(a.n_dare).toLocaleDateString('th-TH')}</p>
              {a.article_link && (
                <a
                  href={a.article_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm mt-auto line-clamp-1"
                >
                  ลิงก์บทความ
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
