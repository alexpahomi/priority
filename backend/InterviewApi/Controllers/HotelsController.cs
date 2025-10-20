using Microsoft.AspNetCore.Mvc;
using InterviewApi.Models;
using System.Text.Json;

namespace InterviewApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HotelController : ControllerBase
{
    private readonly string _hotelsDataPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "hotels.json");

    /// <summary>
    /// Get all hotels
    /// </summary>
    [HttpGet]
    public ActionResult<List<Hotel>> GetHotels()
    {
        var hotels = ReadHotelsFromJson();
        return Ok(hotels);
    }

    /// <summary>
    /// Helper method to read hotels from JSON file
    /// </summary>
    private List<Hotel> ReadHotelsFromJson()
    {
        try
        {
            if (!System.IO.File.Exists(_hotelsDataPath))
                return new List<Hotel>();

            var json = System.IO.File.ReadAllText(_hotelsDataPath);
            var data = JsonSerializer.Deserialize<HotelData>(json);
            return data?.Hotels ?? new List<Hotel>();
        }
        catch
        {
            return new List<Hotel>();
        }
    }
}

