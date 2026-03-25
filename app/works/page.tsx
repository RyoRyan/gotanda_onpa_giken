import Image from "next/image";
import { getWorksList } from "@/app/_libs/microcms";
import { MEMBERS_LIST_LIMIT } from "@/app/_constants";

export default async function Page() {
  const data = await getWorksList({ limit: MEMBERS_LIST_LIMIT });

  return (
    <>
      <div>
        {data.contents.length === 0 ? (
          <p>作品が登録されていません</p>
        ) : (
          <ul>
            {data.contents.map((work) => (
              <li key={work.id} className="list">
                <Image
                  src={work.image.url}
                  alt=""
                  width={work.image.width}
                  height={work.image.height}
                  className="image"
                />
                <dl>
                  <dt className="name">{work.title}</dt>
                  <dd className="category">{work.category}</dd>
                  <dd className="description">{work.description}</dd>
                </dl>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
